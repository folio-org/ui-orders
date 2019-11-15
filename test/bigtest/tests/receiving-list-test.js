import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import OrderDetailsPage from '../interactors/order-details-page';
import ReceivingPage from '../interactors/receiving-page';
import ReceivingHistoryPage from '../interactors/receiving-history-page';
import { WORKFLOW_STATUS } from '../../../src/common/constants';
import { PHYSICAL } from '../../../src/components/POLine/const';

const RECEIVING_LIST_COUNT = 10;

describe('Receiving', function () {
  setupApplication();

  let order = null;
  let line = null;
  const orderDetailsPage = new OrderDetailsPage();
  const receivingPage = new ReceivingPage();
  const receivingHistoryPage = new ReceivingHistoryPage();

  beforeEach(async function () {
    line = this.server.create('line', {
      orderFormat: PHYSICAL,
      cost: {
        quantityPhysical: 2,
      },
    });

    order = this.server.create('order', {
      workflowStatus: WORKFLOW_STATUS.open,
      compositePoLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
    });

    this.server.createList('piece', RECEIVING_LIST_COUNT);

    this.visit(`/orders/view/${order.id}`);
    await orderDetailsPage.whenLoaded();
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
      await orderDetailsPage.receivingButton.click();
      await receivingPage.whenLoaded();
    });

    it('displays disabled Receive Pieces button', () => {
      expect(receivingPage.receivePiecesButton.isButton).to.be.true;
      expect(receivingPage.receivePiecesButton.isDisabled).to.be.true;
    });

    it('displays Close button', () => {
      expect(receivingPage.closeButton.isButton).to.be.true;
    });

    it('renders Receiving List', () => {
      expect(receivingPage.receivingList().length).to.be.equal(RECEIVING_LIST_COUNT);
    });

    describe('Check one line to receive', () => {
      beforeEach(async function () {
        await receivingPage.receivingList(0).checkLine.click();
      });

      it('Receive Pieces button is enabled', () => {
        expect(receivingPage.receivePiecesButton.isDisabled).to.be.false;
      });
    });

    describe('Check all lines to receive', () => {
      beforeEach(async function () {
        await receivingPage.checkAll.click();
      });

      it('Receive Pieces button is enabled', () => {
        expect(receivingPage.receivePiecesButton.isDisabled).to.be.false;
      });

      describe('Uncheck all lines to receive', () => {
        beforeEach(async function () {
          await receivingPage.checkAll.click();
        });

        it('Receive Pieces button is disabled', () => {
          expect(receivingPage.receivePiecesButton.isDisabled).to.be.true;
        });
      });
    });

    describe('Click on Receiving History button', () => {
      beforeEach(async function () {
        await receivingPage.receivingHistoryButton.click();
      });

      it('go to Order Details pane', () => {
        expect(receivingHistoryPage.$root).to.exist;
      });

      describe('Click on Receiving Items button', () => {
        beforeEach(async function () {
          await receivingHistoryPage.receivingItemsButton.click();
        });

        it('go to Receiving pane', () => {
          expect(receivingPage.$root).to.exist;
        });
      });
    });

    describe('go back from Receiving page to Order Details pane', () => {
      beforeEach(async function () {
        await receivingPage.receivingHistoryButton.click();
      });

      it('go to Receiving History pane', () => {
        expect(receivingHistoryPage.$root).to.exist;
      });
    });
  });
});
