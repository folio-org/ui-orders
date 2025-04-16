import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import {
  ORDER_FORMATS,
} from '@folio/stripes-acq-components';

import { TIMEOUT } from '../interactors/const';
import { WORKFLOW_STATUS } from '../../../src/common/constants';
import setupApplication from '../helpers/setup-application';
import LineDetailsPage from '../interactors/line-details-page';
import OrderDetailsPage from '../interactors/order-details-page';

describe('Line details test', function () {
  const ReceivingApp = () => (<div>Receiving</div>);
  const AgreementsApp = () => (<div>Agreements</div>);
  const InvoiceApp = () => (<div>Invoice</div>);

  setupApplication({
    modules: [
      {
        type: 'app',
        name: '@folio/receiving',
        displayName: 'Receiving',
        route: '/receiving',
        module: ReceivingApp,
      },
      {
        type: 'app',
        name: '@folio/agreements',
        displayName: 'Agreements',
        route: '/erm/agreements',
        module: AgreementsApp,
      },
      {
        type: 'app',
        name: '@folio/invoice',
        displayName: 'Invoice',
        route: '/invoice',
        module: InvoiceApp,
      },
    ],
  });

  let order = null;
  let line = null;
  let fund = null;
  let vendor = null;
  let invoice = null;
  const page = new LineDetailsPage();
  const orderDetails = new OrderDetailsPage();

  this.timeout(TIMEOUT);

  beforeEach(async function () {
    fund = this.server.create('fund');
    vendor = this.server.create('vendor');

    line = this.server.create('line', {
      orderFormat: ORDER_FORMATS.physicalResource,
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
      poLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
    });

    invoice = this.server.create('invoice');

    this.server.create('orderInvoiceRelationship', {
      purchaseOrderId: order.id,
      invoiceId: invoice.id,
    });

    this.server.create('invoice-line', {
      poLineId: line.id,
      invoiceId: invoice.id,
    });

    this.server.create('agreement-line', {
      items: [{
        poLineId: line.id,
      }],
    });

    this.visit(`/orders/view/${order.id}/po-line/view/${line.id}`);
    await page.whenLoaded();
    await page.whenInvoicesLoaded();
    await page.whenAgreementLinesLoaded();
  });

  it('displays Line details pane', function () {
    expect(page.$root).to.exist;
    expect(page.receiveButton.isPresent).to.be.true;
    expect(page.actions.isPresent).to.be.true;
    expect(page.relatedInvoicesAccordion.invoices().length).to.be.equal(1);
    expect(page.closingReasonMessage).to.be.false;
    expect(page.relatedAgreementLinesAccordion.agreementLines().length).to.be.equal(1);
  });

  describe('Receive button can be clicked on PO Line level', function () {
    beforeEach(async function () {
      await page.receiveButton.click();
    });

    it('transition to Receiving', function () {
      expect(this.location.pathname.includes('/receiving')).to.be.true;
    });
  });

  describe('go back to Order Details', function () {
    beforeEach(async function () {
      await page.goBackToOrderButton.click();
      await orderDetails.whenLoaded();
    });

    it('Line Details is closed', function () {
      expect(orderDetails.isPresent).to.be.true;
      expect(page.isPresent).to.be.false;
    });
  });

  describe('Go to Invoices app', function () {
    beforeEach(async function () {
      await page.whenInvoicesLoaded();
      await page.relatedInvoicesAccordion.invoices(0).link();
    });

    it('Line Details page is not presented', function () {
      expect(page.isPresent).to.be.false;
    });
  });

  describe('Go to Agreements app', function () {
    beforeEach(async function () {
      await page.whenAgreementLinesLoaded();
      await page.relatedAgreementLinesAccordion.agreementLines(0).link();
    });

    it('Line Details page is not presented', function () {
      expect(page.isPresent).to.be.false;
    });
  });
});
