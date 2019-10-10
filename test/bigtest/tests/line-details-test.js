import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { WORKFLOW_STATUS } from '../../../src/common/constants';
import { PHYSICAL } from '../../../src/components/POLine/const';
import setupApplication from '../helpers/setup-application';
import LineDetailsPage from '../interactors/line-details-page';
import ReceivingPage from '../interactors/receiving-page';

describe('Line details test', function () {
  setupApplication();

  let order = null;
  let line = null;
  let fund = null;
  let vendor = null;
  let invoice = null;
  const page = new LineDetailsPage();
  const receivingPage = new ReceivingPage();

  beforeEach(async function () {
    fund = this.server.create('fund');
    vendor = this.server.create('vendor');

    line = this.server.create('line', {
      orderFormat: PHYSICAL,
      cost: {
        quantityPhysical: 2,
      },
      fundDistribution: [
        {
          fundId: fund.id,
          value: 100,
        },
      ],
    });

    order = this.server.create('order', {
      workflowStatus: WORKFLOW_STATUS.open,
      vendor: vendor.id,
      compositePoLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
    });

    invoice = this.server.create('invoice');

    this.server.create('orderInvoiceRelationships', {
      purchaseOrderId: order.id,
      invoiceId: invoice.id,
    });

    this.server.create('invoice-line', {
      poLineId: line.id,
      invoiceId: invoice.id,
    });

    this.visit(`/orders/view/${order.id}/po-line/view/${line.id}`);
    await page.whenLoaded();
  });

  it('displays Line details pane', function () {
    expect(page.$root).to.exist;
    expect(page.receiveButton.isPresent).to.be.true;
  }).timeout(5000);

  it('does not display actions', function () {
    expect(page.actions.isPresent).to.be.false;
  });

  describe('Receive button can be clicked on PO Line level', function () {
    beforeEach(async function () {
      await page.receiveButton.click();
    });

    it('transition to Receiving screen', function () {
      expect(receivingPage.$root).to.exist;
    });
  });

  describe('go back to Order Details', function () {
    beforeEach(async function () {
      await page.goBackToOrderButton.click();
    });

    it('Line Details is closed', function () {
      expect(page.isPresent).to.be.false;
    });
  });

  describe('Go to Invoices app', function () {
    beforeEach(async function () {
      await page.relatedInvoicesAccordion.invoices(0).link();
    });

    it('Line Details page is not presented', function () {
      expect(page.isPresent).to.be.false;
    });
  });
});
