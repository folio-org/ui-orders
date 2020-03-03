import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import OrdersInteractor from '../interactors/orders';

const ORDERS_COUNT = 15;

describe('Orders', function () {
  setupApplication();

  const orders = new OrdersInteractor();

  beforeEach(async function () {
    this.server.createList('order', ORDERS_COUNT);
    this.visit('/orders');
    await orders.whenLoaded();
  });

  it('is no results message label present', () => {
    expect(orders.isNoResultsMessageLabelPresent).to.equal(true);
    expect(orders.hasCreateOrderButton).to.be.true;
  });

  describe('search by poNumber', function () {
    beforeEach(async function () {
      const order = this.server.schema.orders.first();

      await orders.chooseSearchOption('PO number');
      await orders.fillSearchField(order.poNumber);
      await orders.clickSearch();
    });

    it('shows the list of order items', () => {
      expect(orders.isVisible).to.equal(true);
    });

    it('should find order with given PO number', () => {
      expect(orders.orders().length).to.be.equal(ORDERS_COUNT);
    });

    describe('clicking on the first item', function () {
      beforeEach(async function () {
        await orders.orders(0).click();
      });

      it('loads the order details', function () {
        expect(orders.order.isVisible).to.equal(true);
      });
    });
  });

  describe('filter by status', function () {
    it('should NOT have Open and Pending checked by default', () => {  // UIOR-406
      expect(orders.filters.statusOpenChecked).to.be.false;
      expect(orders.filters.statusPendingChecked).to.be.false;
      expect(orders.filters.statusClosedChecked).to.be.false;
    });
  });

  describe('filter by dateOrdered', function () {
    beforeEach(async function () {
      await orders.filters.fillDateOrderedStart('2019-01-01');
      await orders.filters.fillDateOrderedEnd('2019-08-01');
      await orders.filters.applyDateOrdered.click();
      await orders.whenListLoaded();
    });

    it('should load list without errors', () => {
      expect(orders.orders().length).to.be.equal(ORDERS_COUNT);
    });
  });

  describe('by renewalReviewPeriod', function () {
    beforeEach(async function () {
      await orders.filters.fillRenewalReviewPeriod(15);
      await orders.whenListLoaded();
    });

    it('should load list without errors', () => {
      expect(orders.orders().length).to.be.equal(ORDERS_COUNT);
    });
  });
});
