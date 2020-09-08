import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { TIMEOUT } from '../../interactors/const';
import setupApplication from '../../helpers/setup-application';
import LineEditPage from '../../interactors/line-edit-page';
import LineDetailsPage from '../../interactors/line-details-page';

describe('Create PO Line simple test', function () {
  setupApplication();

  let order = null;
  let vendor = null;
  const lineEditPage = new LineEditPage();
  const lineDetailsPage = new LineDetailsPage();

  this.timeout(TIMEOUT);

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
        await lineEditPage.listUnitPrice.focus();
        await lineEditPage.listUnitPrice.fill(3.333);
        await lineEditPage.listUnitPrice.blur();
        await lineEditPage.quantityPhysical.focus();
        await lineEditPage.quantityPhysical.fill(2);
        await lineEditPage.quantityPhysical.blur();
        await lineEditPage.physicalCreateInventory.focus();
        await lineEditPage.physicalCreateInventory.select('None');
        await lineEditPage.physicalCreateInventory.blur();
        await lineEditPage.saveButton.blur();
        await lineEditPage.saveButton.focus();
        await lineEditPage.saveButton.click();

        const purchaseOrder = this.server.schema.orders.first();
        const newLine = this.server.schema.lines.first();

        purchaseOrder.update({ compositePoLines: [newLine.attrs] });

        await lineDetailsPage.whenLoaded();
      });

      it('goes to details page', function () {
        expect(lineDetailsPage.isPresent).to.be.true;
      });
    });
  });
});
