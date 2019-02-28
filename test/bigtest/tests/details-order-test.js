import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import OrderDetailsPage from '../interactors/order-details-page';
import OrderEditPage from '../interactors/order-edit-page';
import LineEditPage from '../interactors/line-edit-page';
// import LinesLimitModal from '../interactors/lines-limit-modal';

describe('OrderDetailsPage', () => {
  setupApplication();
  const lineEditPage = new LineEditPage();
  const orderDetailsPage = new OrderDetailsPage();
  const orderEditPage = new OrderEditPage();
  // const linesLimitModal = new LinesLimitModal();
  let order = null;

  beforeEach(function () {
    order = this.server.create('order');

    this.visit(`/orders/view/${order.id}`);
  });

  it('displays the order number in the pane header', () => {
    expect(orderDetailsPage.title).to.include(order.po_number);
  });

  describe('clicking on edit', () => {
    beforeEach(async () => {
      await orderDetailsPage.headerDropdown.click();
    });

    it('should redirect to order edit page', () => {
      expect(orderEditPage.$root).to.exist;
    });
  });

  describe('clicking on add Line', () => {
    beforeEach(async () => {
      await orderDetailsPage.addLineButton();
    });

    it('should redirect to add line page', () => {
      // expect(linesLimitModal.$root).to.exist;
      // linesLimitModal.createOrder();

      // should be fixed with new order creation test (POST)
      expect(lineEditPage.$root).to.exist;
    });
  });
});
