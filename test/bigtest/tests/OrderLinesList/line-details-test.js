import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_FORMATS } from '@folio/stripes-acq-components';

import { TIMEOUT } from '../../interactors/const';
import { WORKFLOW_STATUS } from '../../../../src/common/constants';
import setupApplication from '../../helpers/setup-application';
import LineDetailsPage from '../../interactors/line-details-page';
import OrderDetailsPage from '../../interactors/order-details-page';
import ConfirmationModal from '../../interactors/confirmation';

describe('Order lines list - Line details test', function () {
  setupApplication();
  let line = null;
  const page = new LineDetailsPage();
  const orderPage = new OrderDetailsPage();

  this.timeout(TIMEOUT);

  beforeEach(async function () {
    line = this.server.create('line', {
      orderFormat: ORDER_FORMATS.physicalResource,
      cost: {
        quantityPhysical: 2,
      },
    });

    this.server.create('order', {
      workflowStatus: WORKFLOW_STATUS.open,
      poLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
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
        await orderPage.whenLoaded();
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

    it('closes delete line confirmation and Line details pane', function () {
      expect(deleteLineConfirmation.isPresent).to.be.false;
      expect(page.isPresent).to.be.false;
    });
  });
});
