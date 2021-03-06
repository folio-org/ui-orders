import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { TIMEOUT } from '../interactors/const';
import setupApplication from '../helpers/setup-application';
import OrderDetailsPage from '../interactors/order-details-page';
import {
  CONFIG_APPROVALS,
  MODULE_ORDERS,
} from '../../../src/components/Utils/const';
import { WORKFLOW_STATUS } from '../../../src/common/constants';

describe('Approve order action', function () {
  setupApplication();

  const orderDetailsPage = new OrderDetailsPage();

  this.timeout(TIMEOUT);

  beforeEach(async function () {
    this.server.create('config', {
      module: MODULE_ORDERS,
      configName: CONFIG_APPROVALS,
      enabled: true,
      value: '{"isApprovalRequired":true}',
    });

    const pendingOrder = this.server.create('order', {
      approved: false,
      workflowStatus: WORKFLOW_STATUS.pending,
    });

    this.visit(`/orders/view/${pendingOrder.id}`);
    await orderDetailsPage.whenLoaded();
    await orderDetailsPage.approveOrderButton.click();
    await orderDetailsPage.whenLoaded();
  });

  it('Approve button should be hidden after click approve', () => {
    expect(orderDetailsPage.approveOrderButton.isPresent).to.be.false;
  });
});
