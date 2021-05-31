import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_FORMATS } from '@folio/stripes-acq-components';

import {
  ERROR_CODES,
  WORKFLOW_STATUS,
} from '../../../src/common/constants';
import {
  ORDERS_API,
} from '../../../src/components/Utils/api';
import setupApplication from '../helpers/setup-application';
import OrderDetailsPage from '../interactors/order-details-page';
import OpenOrderConfirmationModal from '../interactors/PurchaseOrder/open-order-confirmation-modal';
import OpenOrderErrorModal from '../interactors/PurchaseOrder/open-order-error-modal';
import { TIMEOUT } from '../interactors/const';

const VENDOR_IS_INACTIVE_RESPONSE = {
  'errors': [{
    'message': 'Order cannot be open as the associated vendor is inactive',
    'code': ERROR_CODES.vendorIsInactive,
    'parameters': [],
    'id': '68baa952-ce78-49bb-b495-646482cf3483',
  }],
  'total_records': 1,
};

describe('Open order action', function () {
  setupApplication();

  const orderDetailsPage = new OrderDetailsPage();
  const openOrderConfirmationModal = new OpenOrderConfirmationModal();
  const openOrderErrorModal = new OpenOrderErrorModal();

  this.timeout(TIMEOUT);

  beforeEach(async function () {
    const line = this.server.create('line', {
      orderFormat: ORDER_FORMATS.physicalResource,
      cost: {
        quantityPhysical: 2,
      },
    });

    const pendingOrder = this.server.create('order', {
      workflowStatus: WORKFLOW_STATUS.pending,
      compositePoLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
    });

    this.visit(`/orders/view/${pendingOrder.id}`);

    await orderDetailsPage.whenLoaded();
  });

  it('button for pending order with at least one POL should be visible', () => {
    expect(orderDetailsPage.openOrderButton.isPresent).to.be.true;
  });

  describe('click action', () => {
    beforeEach(async () => {
      await orderDetailsPage.openOrderButton.click();
      await openOrderConfirmationModal.whenLoaded();
    });

    it('should open Open Order Confirmation Modal', () => {
      expect(openOrderConfirmationModal.isPresent).to.be.true;
    });
  });

  describe('click close action on modal', () => {
    beforeEach(async () => {
      await orderDetailsPage.openOrderButton.click();
      await openOrderConfirmationModal.whenLoaded();
      await openOrderConfirmationModal.cancelAction();
    });

    it('should close Open Order Confirmation Modal', () => {
      expect(openOrderConfirmationModal.isPresent).to.be.false;
    });
  });

  describe('click submit action on modal', () => {
    beforeEach(async function () {
      this.server.put(`${ORDERS_API}/:id`, VENDOR_IS_INACTIVE_RESPONSE, 422);
      await orderDetailsPage.openOrderButton.click();
      await openOrderConfirmationModal.whenLoaded();
      await openOrderConfirmationModal.submitAction();
      await orderDetailsPage.whenLoaded();
    });

    it('should close Open Order Confirmation Modal and open Error modal', () => {
      expect(openOrderErrorModal.isPresent).to.be.true;
      expect(openOrderConfirmationModal.isPresent).to.be.false;
    });
  });
});
