import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import {
  ORDER_TYPE,
  WORKFLOW_STATUS,
} from '../../../src/common/constants';
import setupApplication from '../helpers/setup-application';
import OrderDetailsPage from '../interactors/order-details-page';
import OrderEditPage from '../interactors/order-edit-page';
import LineEditPage from '../interactors/line-edit-page';
import {
  CONFIG_ADDRESSES,
  MODULE_ORDERS,
} from '../../../src/components/Utils/const';

const ADDRESS = 'TEST ADDRESS';

describe('Order Details Page', function () {
  setupApplication();

  const lineEditPage = new LineEditPage();
  const orderDetailsPage = new OrderDetailsPage();
  const orderEditPage = new OrderEditPage();

  let order = null;
  let vendor = null;
  let configs = null;

  beforeEach(async function () {
    configs = this.server.create('configs', {
      module: MODULE_ORDERS,
      configName: CONFIG_ADDRESSES,
      enabled: true,
      value: '{"name": "ADDRESS NAME","address": "TEST ADDRESS"}',
    });
    vendor = this.server.create('vendor');
    order = this.server.create('order', {
      workflowStatus: WORKFLOW_STATUS.pending,
      orderType: ORDER_TYPE.ongoing,
      vendor: vendor.id,
      billTo: configs.id,
      shipTo: configs.id,
    });

    this.visit(`/orders/view/${order.id}`);
    await orderDetailsPage.whenLoaded();
  });

  it('displays Order Details pane', () => {
    expect(orderDetailsPage.header.title).to.include(order.poNumber);
    expect(orderDetailsPage.renewalsAccordion).to.be.true;
    expect(orderDetailsPage.addLineButton.isButton).to.equal(true);
    expect(orderDetailsPage.addLineButton.isDisabled).to.equal(false);
    expect(orderDetailsPage.billTo.value).to.contain(ADDRESS);
    expect(orderDetailsPage.shipTo.value).to.contain(ADDRESS);
  });

  describe('clicking on edit', () => {
    beforeEach(async () => {
      await orderDetailsPage.editOrderButton.click();
    });

    it('should redirect to order edit page', () => {
      expect(orderEditPage.$root).to.exist;
    });
  });

  describe('clicking on add Line', () => {
    beforeEach(async () => {
      await orderDetailsPage.addLineButton.click();
    });

    it('should redirect to add line page', () => {
      expect(lineEditPage.$root).to.exist;
    });
  });
});
