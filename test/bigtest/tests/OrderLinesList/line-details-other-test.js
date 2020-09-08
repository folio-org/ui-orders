import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { TIMEOUT } from '../../interactors/const';
import { WORKFLOW_STATUS } from '../../../../src/common/constants';
import { OTHER } from '../../../../src/components/POLine/const';
import setupApplication from '../../helpers/setup-application';
import LineDetailsPage from '../../interactors/line-details-page';

describe('Order lines list - Line details with other format test', function () {
  setupApplication();
  const page = new LineDetailsPage();

  this.timeout(TIMEOUT);

  beforeEach(async function () {
    const vendor = this.server.create('vendor');
    const line = this.server.create('line', {
      orderFormat: OTHER,
      cost: {
        quantityPhysical: 2,
      },
    });

    this.server.create('order', {
      id: line.attrs.purchaseOrderId,
      workflowStatus: WORKFLOW_STATUS.open,
      vendor: vendor.id,
      compositePoLines: [line.attrs],
    });

    this.visit(`/orders/lines/view/${line.id}/`);
    await page.whenLoaded();
  });

  it('displays Other details accordion', function () {
    expect(page.otherDetailsAccordion).to.be.true;
  });
});
