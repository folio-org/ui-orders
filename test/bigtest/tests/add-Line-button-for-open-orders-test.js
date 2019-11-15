import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { WORKFLOW_STATUS } from '../../../src/common/constants';
import setupApplication from '../helpers/setup-application';
import OrderDetailsPage from '../interactors/order-details-page';

describe('Add Line button should be disabled for Open orders', function () {
  setupApplication();

  const orderDetailsPage = new OrderDetailsPage();
  let openOrder = null;

  beforeEach(async function () {
    openOrder = this.server.create('order', { workflowStatus: WORKFLOW_STATUS.open });

    this.visit(`/orders/view/${openOrder.id}`);
    await orderDetailsPage.whenLoaded();
  });

  it('Add Line button is disabled', () => {
    expect(orderDetailsPage.addLineButton.isDisabled).to.equal(true);
  });
});
