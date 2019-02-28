import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import OrderDetailsPage from '../interactors/order-details-page';
import ReceivingPage from '../interactors/receiving-page';
import { WORKFLOW_STATUS } from '../../../src/components/PurchaseOrder/Summary/FieldWorkflowStatus';
import { PHYSICAL } from '../../../src/components/POLine/const';
import {
  ORDERS_API,
} from '../../../src/components/Utils/api';

const RECEIVING_LIST_COUNT = 10;

describe('Receiving', () => {
  setupApplication();

  let order = null;
  let line = null;
  const orderDetailsPage = new OrderDetailsPage();
  const receivingPage = new ReceivingPage();

  beforeEach(async function () {
    order = await this.server.create('order', {
      workflow_status: WORKFLOW_STATUS.open,
    });
    line = await this.server.create('line', {
      order,
      order_format: PHYSICAL,
      cost: {
        quantity_physical: 2,
      },
    });
    this.server.get(`${ORDERS_API}/${order.id}`, {
      ...order.attrs,
      compositePoLines: [line.attrs],
    });

    this.server.createList('piece', RECEIVING_LIST_COUNT);

    await this.visit(`/orders/view/${order.id}`);
  });

  it('displays Order Details pane', () => {
    expect(orderDetailsPage.$root).to.exist;
  });

  it('displays the Receive button', () => {
    expect(orderDetailsPage.receivingButton.isButton).to.be.true;
  });

  describe('go to receiving list', () => {
    beforeEach(async function () {
      await orderDetailsPage.receivingButton.click();
    });

    it('displays Receiving screen', () => {
      expect(receivingPage.$root).to.exist;
    });
  });

  describe('displays Receiving page', () => {
    beforeEach(async function () {
      await this.visit(`/orders/view/${order.id}/receiving`);
    });

    it('displays Receive Pieces button', () => {
      expect(receivingPage.receivePiecesButton.isButton).to.be.true;
    });

    it('displays Close button', () => {
      expect(receivingPage.closeButton.isButton).to.be.true;
    });

    it('renders Receiving List', () => {
      expect(receivingPage.receivingList().length).to.be.equal(RECEIVING_LIST_COUNT);
    });

    describe('go back from Receiving page to Order Details pane', () => {
      beforeEach(async function () {
        await receivingPage.closeButton.click();
      });

      it('go to Order Details pane', () => {
        expect(orderDetailsPage.$root).to.exist;
      });
    });
  });
});
