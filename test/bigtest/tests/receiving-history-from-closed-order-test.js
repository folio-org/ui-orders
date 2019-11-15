import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import OrderDetailsPage from '../interactors/order-details-page';
import ReceivingHistoryPage from '../interactors/receiving-history-page';
import { WORKFLOW_STATUS } from '../../../src/common/constants';
import { PHYSICAL } from '../../../src/components/POLine/const';

describe('go to receiving history from closed PO', function () {
  setupApplication();

  let order = null;
  let line = null;
  const orderDetailsPage = new OrderDetailsPage();
  const receivingHistoryPage = new ReceivingHistoryPage();

  beforeEach(async function () {
    line = this.server.create('line', {
      orderFormat: PHYSICAL,
      cost: {
        quantityPhysical: 2,
      },
    });
    order = this.server.create('order', {
      workflowStatus: WORKFLOW_STATUS.closed,
      compositePoLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
    });

    this.visit(`/orders/view/${order.id}`);
    await orderDetailsPage.whenLoaded();
  });

  it('displays the Receive button', () => {
    expect(orderDetailsPage.receivingButton.isButton).to.be.true;
  });

  describe('go to receiving history', () => {
    beforeEach(async function () {
      await orderDetailsPage.receivingButton.click();
    });

    it('displays Receiving history screen', () => {
      expect(receivingHistoryPage.$root).to.exist;
    });
  });
});
