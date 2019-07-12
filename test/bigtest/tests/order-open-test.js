import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { WORKFLOW_STATUS } from '../../../src/components/PurchaseOrder/Summary/FieldWorkflowStatus';
import { PHYSICAL } from '../../../src/components/POLine/const';
import {
  ORDERS_API,
} from '../../../src/components/Utils/api';
import setupApplication from '../helpers/setup-application';
import OrderDetailsPage from '../interactors/order-details-page';
import OpenOrderConfirmationModal from '../interactors/PurchaseOrder/open-order-confirmation-modal';
import OpenOrderErrorModal from '../interactors/PurchaseOrder/open-order-error-modal';
import { ERROR_CODES } from '../../../src/components/Utils/order';

describe('Open order action', function () {
  setupApplication();

  const orderDetailsPage = new OrderDetailsPage();
  const openOrderConfirmationModal = new OpenOrderConfirmationModal();

  beforeEach(async function () {
    const line = this.server.create('line', {
      orderFormat: PHYSICAL,
      cost: {
        quantityPhysical: 2,
      },
    });

    const pendingOrder = this.server.create('order', {
      workflowStatus: WORKFLOW_STATUS.pending,
      compositePoLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
    });

    const VENDOR_IS_INACTIVE_RESPONSE = {
      'errors': [{
        'message': 'Order cannot be open as the associated vendor is inactive',
        'code': ERROR_CODES.vendorIsInactive,
        'parameters': [],
        'id': '68baa952-ce78-49bb-b495-646482cf3483',
      }],
      'total_records': 1,
    };

    this.server.put(`${ORDERS_API}/:id`, VENDOR_IS_INACTIVE_RESPONSE, 422);

    this.visit(`/orders/view/${pendingOrder.id}`);
    await orderDetailsPage.whenLoaded();
  });

  describe('button for pending order with at least one POL', () => {
    it('should be visible', () => {
      expect(orderDetailsPage.openOrderButton.isPresent).to.be.true;
    });

    describe('click action', () => {
      beforeEach(async () => {
        await orderDetailsPage.openOrderButton.click();
      });

      it('should open Open Order Confirmation Modal', () => {
        expect(openOrderConfirmationModal.isPresent).to.be.true;
      });
    });

    describe('click close action on modal', () => {
      beforeEach(async () => {
        await orderDetailsPage.openOrderButton.click();
        await openOrderConfirmationModal.cancelAction();
      });

      it('should close Open Order Confirmation Modal', () => {
        expect(openOrderConfirmationModal.isPresent).to.be.false;
      });
    });

    describe('click submit action on modal', () => {
      const openOrderErrorModal = new OpenOrderErrorModal();

      beforeEach(async () => {
        await orderDetailsPage.openOrderButton.click();
        await openOrderConfirmationModal.submitAction();
      });

      it('should close Open Order Confirmation Modal and open Error modal', () => {
        expect(openOrderErrorModal.isPresent).to.be.true;
        expect(openOrderConfirmationModal.isPresent).to.be.false;
      });
    });
  });

  Object.values(WORKFLOW_STATUS).forEach(status => {
    describe(`button for ${status} order without POLs`, () => {
      beforeEach(function () {
        const newOrder = this.server.create('order', {
          workflowStatus: status,
        });

        this.visit(`/orders/view/${newOrder.id}`);
      });

      it('should not be visible', () => {
        expect(orderDetailsPage.openOrderButton.isPresent).not.to.be.true;
      });
    });
  });
});
