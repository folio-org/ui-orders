import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import CloseOrderModal from '../../interactors/PurchaseOrder/close-order-modal';
import OrderDetailsPage from '../../interactors/order-details-page';
import { WORKFLOW_STATUS } from '../../../../src/common/constants';
import {
  CONFIG_CLOSING_REASONS,
  MODULE_ORDERS,
} from '../../../../src/components/Utils/const';

const REASON = 'test reason';

describe('Close Order Modal', function () {
  setupApplication();

  let order = null;
  const modal = new CloseOrderModal();
  const page = new OrderDetailsPage();

  beforeEach(async function () {
    order = this.server.create('order', {
      workflowStatus: WORKFLOW_STATUS.open,
    });

    this.server.create('config', {
      module: MODULE_ORDERS,
      configName: CONFIG_CLOSING_REASONS,
      enabled: true,
      value: REASON,
      code: 'CLOSING_REASON_1',
    });

    this.visit(`/orders/view/${order.id}`);
    await page.whenLoaded();
    await page.closeOrderButton.click();
  });

  it('Close Order Modal is shown', () => {
    expect(modal.$root).to.exist;
    expect(modal.submitButton.isButton).to.be.true;
    expect(modal.submitButton.isDisabled).to.be.true;
    expect(modal.cancelButton.isButton).to.be.true;
    expect(modal.reasonSelect.isSelect).to.be.true;
  });

  describe('select closing reason from settings and submit', () => {
    beforeEach(async function () {
      await modal.reasonSelect.select(REASON);
      await modal.submitButton.click();
    });

    it('Close Order Modal is closed and workflow status is updated', () => {
      expect(modal.isPresent).to.be.false;
      expect(page.closeReasonBlock).to.be.true;
    });
  });

  describe('close Close Order Modal', () => {
    beforeEach(async function () {
      await modal.cancelButton.click();
    });

    it('displays Order details page', () => {
      expect(page.$root).to.exist;
    });
  });
});
