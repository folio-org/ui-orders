import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import LineEditPage from '../../interactors/line-edit-page';
import OrdersInteractor from '../../interactors/orders';

describe('Create PO Line simple test', function () {
  setupApplication();

  let order = null;
  let vendor = null;
  const lineEditPage = new LineEditPage();
  const ordersList = new OrdersInteractor();

  beforeEach(async function () {
    vendor = this.server.create('vendor');
    order = this.server.create('order', {
      vendor: vendor.id,
    });

    this.visit(`/orders/view/${order.id}/po-line/create`);
    await lineEditPage.whenLoaded();
  });

  it('Has to render expected title', function () {
    expect(lineEditPage.title).to.be.equal('Add PO line');
    expect(lineEditPage.saveButton.isDisabled).to.be.true;
  });

  describe('Add title', () => {
    beforeEach(async function () {
      await lineEditPage.itemDetailsAccordion.inputTitle('test');
    });

    it('enables save button', function () {
      expect(lineEditPage.saveButton.isDisabled).to.be.false;
    });

    describe('Fill values and click save', () => {
      beforeEach(async function () {
        await lineEditPage.acquisitionMethod('Approval plan');
        await lineEditPage.selectOrderFormat('Physical resource');
        await lineEditPage.listUnitPrice.fill(3.333);
        await lineEditPage.quantityPhysical.fill(2);
        await lineEditPage.physicalCreateInventory.select('None');
        await lineEditPage.saveButton.click();
        await ordersList.whenListLoaded();
      });

      it('goes to details page', function () {
        expect(lineEditPage.isPresent).to.be.false;
        expect(ordersList.isPresent).to.be.true;
      });
    });
  });
});
