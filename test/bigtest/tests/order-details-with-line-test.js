import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_FORMATS } from '@folio/stripes-acq-components';

import { TIMEOUT } from '../interactors/const';
import {
  ORDER_TYPE,
  WORKFLOW_STATUS,
} from '../../../src/common/constants';
import setupApplication from '../helpers/setup-application';
import OrderDetailsPage from '../interactors/order-details-page';
import LineDetailsPage from '../interactors/line-details-page';

describe('Order details with Line', function () {
  const InvoiceApp = () => (<div>Invoice</div>);

  setupApplication({
    modules: [
      {
        type: 'app',
        name: '@folio/invoice',
        displayName: 'Invoice',
        route: '/invoice',
        module: InvoiceApp,
      },
    ],
  });

  const lineDetailsPage = new LineDetailsPage();
  const orderDetailsPage = new OrderDetailsPage();

  let order = null;
  let vendor = null;
  let line = null;
  let invoice = null;

  this.timeout(TIMEOUT);

  beforeEach(async function () {
    vendor = this.server.create('vendor');

    line = this.server.create('line', {
      orderFormat: ORDER_FORMATS.physicalResource,
      cost: {
        quantityPhysical: 2,
      },
      receiptDate: '1111-11-11',
    });

    order = this.server.create('order', {
      workflowStatus: WORKFLOW_STATUS.open,
      orderType: ORDER_TYPE.ongoing,
      vendor: vendor.id,
      poLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
    });

    invoice = this.server.create('invoice');

    this.server.create('orderInvoiceRelationship', {
      purchaseOrderId: order.id,
      invoiceId: invoice.id,
    });

    this.visit(`/orders/view/${order.id}`);
    await orderDetailsPage.whenLoaded();
    await orderDetailsPage.whenInvoicesLoaded();
  });

  it('displays the order details pane', () => {
    expect(orderDetailsPage.isPresent).to.be.true;
    expect(orderDetailsPage.totalEncumbered).to.be.true;
  });

  it('displays list with lines', () => {
    expect(orderDetailsPage.lines().length).to.be.equal(1);
  });

  describe('clicking on line', () => {
    beforeEach(async () => {
      await orderDetailsPage.lines(0).click();
      await lineDetailsPage.whenLoaded();
    });

    it('should redirect to Line Details pane', () => {
      expect(lineDetailsPage.isPresent).to.be.true;
    });
  });

  describe('clicking on invoice number', () => {
    beforeEach(async function () {
      await orderDetailsPage.whenInvoicesLoaded();
      await orderDetailsPage.relatedInvoicesAccordion.invoices(0).link();
    });

    it('should redirect to Invoices app', () => {
      expect(orderDetailsPage.isPresent).to.be.false;
    });
  });
});
