import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { WORKFLOW_STATUS } from '../../../src/common/constants';
import { OTHER } from '../../../src/components/POLine/const';
import setupApplication from '../helpers/setup-application';
import LineDetailsPage from '../interactors/line-details-page';

describe('Orders List - Line details with other format test', function () {
  setupApplication();
  let order = null;
  let line = null;
  let vendor = null;
  const page = new LineDetailsPage();

  beforeEach(async function () {
    vendor = this.server.create('vendor');

    line = this.server.create('line', {
      orderFormat: OTHER,
      cost: {
        quantityPhysical: 2,
      },
    });

    order = this.server.create('order', {
      workflowStatus: WORKFLOW_STATUS.open,
      vendor: vendor.id,
      compositePoLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
    });

    this.visit(`/orders/view/${order.id}/po-line/view/${line.id}`);
    await page.whenLoaded();
  });

  it('displays Other details accordion', function () {
    expect(page.otherDetailsAccordion).to.be.true;
  });
});
