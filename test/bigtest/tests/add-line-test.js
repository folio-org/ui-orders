import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_FORMATS } from '@folio/stripes-acq-components';

import {
  ORDER_TYPE,
  WORKFLOW_STATUS,
} from '../../../src/common/constants';
import LinesLimitModal from '../interactors/lines-limit-modal';
import OrderDetailsPage from '../interactors/order-details-page';
import setupApplication from '../helpers/setup-application';
import {
  CONFIG_LINES_LIMIT,
  LINES_LIMIT_DEFAULT,
  MODULE_ORDERS,
} from '../../../src/components/Utils/const';

describe('clicking on add Line to open LinesLimit Modal', function () {
  setupApplication();

  const linesLimitModal = new LinesLimitModal();
  const orderDetailsPage = new OrderDetailsPage();
  let line = null;
  let order = null;
  let vendor = null;

  beforeEach(async function () {
    vendor = this.server.create('vendor');
    line = this.server.create('line', {
      orderFormat: ORDER_FORMATS.physicalResource,
      cost: {
        quantityPhysical: 2,
      },
    });
    order = this.server.create('order', {
      workflowStatus: WORKFLOW_STATUS.pending,
      orderType: ORDER_TYPE.ongoing,
      vendor: vendor.id,
      compositePoLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
    });

    this.server.create('config', {
      module: MODULE_ORDERS,
      configName: CONFIG_LINES_LIMIT,
      enabled: true,
      value: LINES_LIMIT_DEFAULT,
    });

    this.visit(`/orders/view/${order.id}`);
    await orderDetailsPage.whenLoaded();
  });

  describe('Click Add Line Button', () => {
    beforeEach(async function () {
      await orderDetailsPage.addLineButton.click();
    });

    it('displays LineLimit Modal', () => {
      expect(linesLimitModal.$root).to.exist;
    });
  });

  describe('Click on Create new PO button', () => {
    beforeEach(async function () {
      await orderDetailsPage.addLineButton.click();
      await linesLimitModal.createOrder();
    });

    it('displays PO Line edit page', () => {
      expect(linesLimitModal.isPresent).to.be.false;
    });
  });
});
