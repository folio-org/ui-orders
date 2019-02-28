import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import OrderDetailsPage from '../interactors/order-details-page';
import ReceivingHistoryPage from '../interactors/receiving-history-page';
import { WORKFLOW_STATUS } from '../../../src/components/PurchaseOrder/Summary/FieldWorkflowStatus';

const RECEIVING_LIST_COUNT = 10;

describe('Receiving', () => {
  setupApplication();

  let order = null;
  const orderDetailsPage = new OrderDetailsPage();
  const page = new ReceivingHistoryPage();

  beforeEach(async function () {
    order = await this.server.create('order', {
      workflow_status: WORKFLOW_STATUS.open,
    });

    this.server.createList('piece', RECEIVING_LIST_COUNT);

    await this.visit(`/orders/view/${order.id}/receiving-history`);
  });

  it('displays Receiving History screen', () => {
    expect(page.$root).to.exist;
  });

  it('displays Close button', () => {
    expect(page.closeButton.isButton).to.be.true;
  });

  describe('go back from Receiving History page to Order Details pane', () => {
    beforeEach(async function () {
      await page.closeButton.click();
    });

    it('go to Order Details pane', () => {
      expect(orderDetailsPage.$root).to.exist;
    });
  });
});
