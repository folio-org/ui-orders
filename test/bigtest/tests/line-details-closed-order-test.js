import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import {
  ORDER_FORMATS,
  ORDER_STATUSES,
} from '@folio/stripes-acq-components';

import setupApplication from '../helpers/setup-application';
import LineDetailsPage from '../interactors/line-details-page';

describe('PO Line details - warning message with closing reason is present', function () {
  setupApplication();
  const page = new LineDetailsPage();

  beforeEach(async function () {
    const vendor = this.server.create('vendor');
    const line = this.server.create('line', {
      orderFormat: ORDER_FORMATS.physicalResource,
      cost: {
        quantityPhysical: 2,
      },
    });
    const order = this.server.create('order', {
      workflowStatus: ORDER_STATUSES.closed,
      vendor: vendor.id,
      poLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
    });

    this.visit(`/orders/view/${order.id}/po-line/view/${line.id}`);
    await page.whenLoaded();
  });

  it('displays POL details with order reason for closure', function () {
    expect(page.closingReasonMessage).to.be.true;
  });
});
