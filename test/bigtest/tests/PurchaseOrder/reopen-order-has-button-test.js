import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import OrderDetailsPage from '../../interactors/order-details-page';
import { WORKFLOW_STATUS } from '../../../../src/common/constants';

describe('Reopen Order is enabled', function () {
  setupApplication();

  let order = null;
  const page = new OrderDetailsPage();

  beforeEach(async function () {
    order = this.server.create('order', {
      workflowStatus: WORKFLOW_STATUS.closed,
    });

    this.visit(`/orders/view/${order.id}`);
    await page.whenLoaded();
  });

  it('displays Reopen button', () => {
    expect(page.reopenOrderButton.isPresent).to.be.true;
  });
});
