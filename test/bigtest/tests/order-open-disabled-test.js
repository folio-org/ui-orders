import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { WORKFLOW_STATUS } from '../../../src/common/constants';
import setupApplication from '../helpers/setup-application';
import OrderDetailsPage from '../interactors/order-details-page';

describe('Disabled Open order action', function () {
  setupApplication();

  const orderDetailsPage = new OrderDetailsPage();
  const orders = {};

  beforeEach(async function () {
    Object.values(WORKFLOW_STATUS).forEach(status => {
      orders[status] = this.server.create('order', {
        workflowStatus: status,
      });
    });
  });

  Object.values(WORKFLOW_STATUS).forEach(status => {
    describe(`button for ${status} order without POLs`, () => {
      beforeEach(async function () {
        this.visit(`/orders/view/${orders[status].id}`);
        await orderDetailsPage.whenLoaded();
      });

      it('should not be visible', () => {
        expect(orderDetailsPage.openOrderButton.isPresent).not.to.be.true;
      });
    });
  });
});
