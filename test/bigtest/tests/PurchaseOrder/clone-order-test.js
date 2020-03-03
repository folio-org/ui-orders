import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import OrderDetailsPage from '../../interactors/order-details-page';
import ConfirmationModal from '../../interactors/confirmation';

describe('Clone order', function () {
  setupApplication();

  const page = new OrderDetailsPage();
  let order = null;

  beforeEach(async function () {
    order = this.server.create('order');
    this.visit(`/orders/view/${order.id}`);
    await page.whenLoaded();
  });

  describe('click clone order', () => {
    const cloneOrderConfirmation = new ConfirmationModal('#order-clone-confirmation');

    beforeEach(async function () {
      await page.header.click();
      await page.actionsMenu.clone.click();
    });

    it('shows clone order confirmation', () => {
      expect(cloneOrderConfirmation.isVisible).to.be.true;
    });
  });

  describe('click clone order and cancel', () => {
    const cloneOrderConfirmation = new ConfirmationModal('#order-clone-confirmation');

    beforeEach(async function () {
      await page.header.click();
      await page.actionsMenu.clone.click();
      await cloneOrderConfirmation.cancel();
    });

    it('closes clone order confirmation', () => {
      expect(cloneOrderConfirmation.isPresent).to.be.false;
      expect(page.isVisible).to.be.true;
    });
  });

  describe('click clone order and confirm', () => {
    const cloneOrderConfirmation = new ConfirmationModal('#order-clone-confirmation');

    beforeEach(async function () {
      await page.header.click();
      await page.actionsMenu.clone.click();
      await cloneOrderConfirmation.confirm();
    });

    it('closes clone order confirmation', () => {
      expect(cloneOrderConfirmation.isPresent).to.be.false;
      expect(page.isVisible).to.be.true;
    });
  });
});
