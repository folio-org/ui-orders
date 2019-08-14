import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import OrderDetailsPage from '../interactors/order-details-page';
import {
  CONFIG_APPROVALS,
  MODULE_ORDERS,
} from '../../../src/components/Utils/const';

describe('Approve order action', function () {
  setupApplication();

  const orderDetailsPage = new OrderDetailsPage();

  describe('if approve not required', () => {
    beforeEach(async function () {
      const pendingOrder = this.server.create('order');

      this.visit(`/orders/view/${pendingOrder.id}`);
      await orderDetailsPage.whenLoaded();
    });

    it('should be hide ', () => {
      expect(orderDetailsPage.approveOrderButton.isPresent).to.be.false;
    });
  });

  describe('if approve required', () => {
    beforeEach(async function () {
      this.server.create('configs', {
        module: MODULE_ORDERS,
        configName: CONFIG_APPROVALS,
        enabled: true,
        value: '{"isApprovalRequired":true}',
      });

      const pendingOrder = this.server.create('order');

      this.visit(`/orders/view/${pendingOrder.id}`);
      await orderDetailsPage.whenLoaded();
    });

    it('should be visible ', () => {
      expect(orderDetailsPage.approveOrderButton.isPresent).to.be.true;
    });

    describe('click for approve', () => {
      beforeEach(async function () {
        await orderDetailsPage.approveOrderButton.click();
      });

      it('should be hide after click ', () => {
        expect(orderDetailsPage.approveOrderButton.isPresent).to.be.false;
      });
    });
  });

  describe('if order approved', () => {
    beforeEach(async function () {
      const pendingOrder = this.server.create('order', {
        approved: true,
      });

      this.visit(`/orders/view/${pendingOrder.id}`);
      await orderDetailsPage.whenLoaded();
    });

    it('should be hide ', () => {
      expect(orderDetailsPage.approveOrderButton.isPresent).to.be.false;
    });
  });
});
