import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import LineDetailsPage from '../interactors/line-details-page';
import CheckInHistoryPage from '../interactors/check-in-history-page';
import { WORKFLOW_STATUS } from '../../../src/components/PurchaseOrder/Summary/FieldWorkflowStatus';
import { PIECE_STATUS_RECEIVED } from '../../../src/components/Receiving/const';
import { PHYSICAL } from '../../../src/components/POLine/const';

const RECEIVING_LIST_COUNT = 10;

describe('Check-in history', function () {
  setupApplication();

  let order = null;
  let line = null;
  const lineDetailsPage = new LineDetailsPage();
  const page = new CheckInHistoryPage();

  beforeEach(async function () {
    line = this.server.create('line', {
      orderFormat: PHYSICAL,
      cost: {
        quantityPhysical: 2,
      },
      checkinItems: true,
    });

    order = this.server.create('order', {
      compositePoLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
      workflowStatus: WORKFLOW_STATUS.open,
    });

    this.server.createList('piece', RECEIVING_LIST_COUNT, {
      receivingStatus: PIECE_STATUS_RECEIVED,
    });
    this.visit(`/orders/view/${order.id}/po-line/view/${line.id}/check-in/history`);
    await page.whenLoaded();
  });

  it('displays Check-in History screen, pieces, Close button, Remove button disabled', () => {
    expect(page.$root).to.exist;
    expect(page.pieces().length).to.be.equal(RECEIVING_LIST_COUNT);
    expect(page.closeButton.isButton).to.be.true;
    expect(page.removeButton.isButton).to.be.true;
    expect(page.removeButton.isDisabled).to.be.true;
  });

  describe('search text could be entered', () => {
    beforeEach(async () => {
      await page.searchInput.fill('test');
    });

    it('search text is changed to "test"', () => {
      expect(page.searchInput.value).to.be.equal('test');
    });
  });

  describe('Check Item and Enable Remove button', () => {
    beforeEach(async () => {
      await page.pieces(0).checkPiece.click();
    });

    it('Remove button is enabled', () => {
      expect(page.removeButton.isDisabled).to.be.false;
    });
  });

  describe('Click Remove button', () => {
    beforeEach(async () => {
      await page.pieces(0).checkPiece.click();
      await page.removeButton.click();
    });

    it('Confirmation is displayed', () => {
      expect(page.confirmationModal.$root).to.exist;
    });

    describe('Click Confirm button', () => {
      beforeEach(async () => {
        await page.confirmationModal.confirmButton();
      });

      it('Confirmation is disappeared', () => {
        expect(page.confirmationModal.isPresent).to.be.false;
      });
    });

    describe('Click Cancel button', () => {
      beforeEach(async () => {
        await page.confirmationModal.cancelButton();
      });

      it('Confirmation is disappeared', () => {
        expect(page.confirmationModal.isPresent).to.be.false;
      });
    });
  });

  describe('Check all pieces to remove', () => {
    beforeEach(async function () {
      await page.checkAllCheckbox.click();
    });

    it('Remove button is enabled', () => {
      expect(page.removeButton.isDisabled).to.be.false;
    });

    describe('Uncheck all pieces', () => {
      beforeEach(async function () {
        await page.checkAllCheckbox.click();
      });

      it('Remove button is disabled', () => {
        expect(page.removeButton.isDisabled).to.be.true;
      });
    });
  });

  describe('go back from Check-in History page to Line Details pane', () => {
    beforeEach(async function () {
      await page.closeButton.click();
    });

    it('go to Line Details pane', () => {
      expect(lineDetailsPage.$root).to.exist;
    });
  });
});
