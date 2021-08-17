import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { WORKFLOW_STATUS } from '../../../src/common/constants';
import setupApplication from '../helpers/setup-application';
import OrderDetailsPage from '../interactors/order-details-page';
import { TIMEOUT } from '../interactors/const';

describe('Disabled Open order action', function () {
  setupApplication();

  this.timeout(TIMEOUT);

  const orderDetailsPage = new OrderDetailsPage();

  describe(`button for ${WORKFLOW_STATUS.closed} order without POLs`, () => {
    beforeEach(async function () {
      const order = this.server.create('order', {
        workflowStatus: WORKFLOW_STATUS.closed,
      });

      this.visit(`/orders/view/${order.id}`);
      await orderDetailsPage.whenLoaded();
    });

    it('should not be visible', () => {
      expect(orderDetailsPage.openOrderButton.isPresent).not.to.be.true;
    });
  });

  describe(`button for ${WORKFLOW_STATUS.open} order without POLs`, () => {
    beforeEach(async function () {
      const order = this.server.create('order', {
        workflowStatus: WORKFLOW_STATUS.open,
      });

      this.visit(`/orders/view/${order.id}`);
      await orderDetailsPage.whenLoaded();
    });

    it('should not be visible', () => {
      expect(orderDetailsPage.openOrderButton.isPresent).not.to.be.true;
    });
  });

  describe(`button for ${WORKFLOW_STATUS.pending} order without POLs`, () => {
    beforeEach(async function () {
      const order = this.server.create('order', {
        workflowStatus: WORKFLOW_STATUS.pending,
      });

      this.visit(`/orders/view/${order.id}`);
      await orderDetailsPage.whenLoaded();
    });

    it('should not be visible', () => {
      expect(orderDetailsPage.openOrderButton.isPresent).not.to.be.true;
    });
  });
});
