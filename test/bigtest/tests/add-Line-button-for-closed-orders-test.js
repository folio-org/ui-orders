import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { WORKFLOW_STATUS } from '../../../src/common/constants';
import setupApplication from '../helpers/setup-application';
import OrderDetailsPage from '../interactors/order-details-page';

describe('Add Line button should be disabled for Closed orders', function () {
  setupApplication();

  const orderDetailsPage = new OrderDetailsPage();
  let closedOrder = null;

  beforeEach(async function () {
    closedOrder = this.server.create('order', { workflowStatus: WORKFLOW_STATUS.closed });

    this.visit(`/orders/view/${closedOrder.id}`);
    await orderDetailsPage.whenLoaded();
  });

  it('Add Line button is disabled', () => {
    expect(orderDetailsPage.addLineButton.isDisabled).to.equal(true);
  });
});
