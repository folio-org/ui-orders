import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { WORKFLOW_STATUS } from '../../../../src/components/PurchaseOrder/Summary/FieldWorkflowStatus';
import { PHYSICAL } from '../../../../src/components/POLine/const';
import setupApplication from '../../helpers/setup-application';
import LineDetailsPage from '../../interactors/line-details-page';
import OrderDetailsPage from '../../interactors/order-details-page';
import { ORDERS_API } from '../../../../src/components/Utils/api';
import ConfirmationModal from '../../interactors/confirmation';

describe('Order lines list - Line details test', function () {
  setupApplication();
  let order = null;
  let line = null;
  const page = new LineDetailsPage();
  const orderPage = new OrderDetailsPage();

  beforeEach(async function () {
    order = this.server.create('order', {
      workflowStatus: WORKFLOW_STATUS.open,
    });
    line = this.server.create('line', {
      purchaseOrderId: order.id,
      order,
      orderFormat: PHYSICAL,
      cost: {
        quantityPhysical: 2,
      },
    });

    this.server.get(`${ORDERS_API}/${order.id}`, {
      ...order.attrs,
      compositePoLines: [line.attrs],
    });

    this.visit(`/orders/lines/view/${line.id}`);
    await page.whenLoaded();
  });

  it('displays Line details pane', function () {
    expect(page.isPresent).to.be.true;
  });

  describe('actions', function () {
    beforeEach(async function () {
      await page.actions.toggle.click();
    });

    it('should be present', function () {
      expect(page.actions.isPresent).to.be.true;
    });

    describe('View PO', function () {
      beforeEach(async function () {
        await page.actions.viewPOButton.click();
      });

      it('should redirect to PO details', function () {
        expect(orderPage.isPresent).to.be.true;
      });
    });
  });

  describe('click delete line and confirm', function () {
    const deleteLineConfirmation = new ConfirmationModal('#delete-line-confirmation');

    beforeEach(async function () {
      await page.actions.toggle.click();
      await page.actions.delete.click();
      await deleteLineConfirmation.confirm();
    });

    it('closes delete line confirmation', function () {
      expect(deleteLineConfirmation.isPresent).to.be.false;
    });

    it('closes Line Details Pane', function () {
      expect(page.isPresent).to.be.false;
    });
  });
});
