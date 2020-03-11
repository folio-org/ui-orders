import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ConfirmationInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import setupApplication from '../../helpers/setup-application';
import ClosingReasonsInteractor from '../../interactors/settings/ClosingReasons/ClosingReasons';

describe('Setting of Closing Reasons', function () {
  setupApplication();

  const closingReasonsSetting = new ClosingReasonsInteractor();
  const deleteConfirmation = new ConfirmationInteractor('#delete-controlled-vocab-entry-confirmation');

  beforeEach(async function () {
    this.visit('/settings/orders/closing-reasons');
    await closingReasonsSetting.whenLoaded();
  });

  it('should be rendered', () => {
    expect(closingReasonsSetting.isPresent).to.be.true;
    expect(closingReasonsSetting.closingReasons.isPresent).to.be.false;
  });

  describe('Add new reason', function () {
    beforeEach(async function () {
      await closingReasonsSetting.addReasonBtn.click();
    });

    it('renders fields for new reason', () => {
      expect(closingReasonsSetting.closingReasons.list(0).saveButton.isPresent).to.be.true;
      expect(closingReasonsSetting.closingReasons.list(0).cancelButton.isPresent).to.be.true;
    });

    describe('Cancel add new reason', function () {
      beforeEach(async function () {
        await closingReasonsSetting.closingReasons.list(0).cancelButton.click();
      });

      it('renders fields for new reason', () => {
        expect(closingReasonsSetting.closingReasons.isPresent).to.be.false;
      });
    });

    describe('Save new reason', function () {
      beforeEach(async function () {
        await closingReasonsSetting.closingReasons.list(0).nameInput.fill('test');
        await closingReasonsSetting.closingReasons.list(0).saveButton.click();
      });

      it('renders saved reason', () => {
        expect(closingReasonsSetting.closingReasons.list().length).to.equal(1);
      });

      describe('Edit reason', function () {
        beforeEach(async function () {
          await closingReasonsSetting.closingReasons.list(0).editButton.click();
          await closingReasonsSetting.closingReasons.list(0).nameInput.fill('test new');
          await closingReasonsSetting.closingReasons.list(0).saveButton.click();
        });

        it('renders edited reason', () => {
          expect(closingReasonsSetting.closingReasons.list().length).to.equal(1);
        });
      });

      describe('Delete reason', function () {
        beforeEach(async function () {
          await closingReasonsSetting.closingReasons.list(0).deleteButton.click();
          await deleteConfirmation.confirm();
        });

        it('does not render empty list', () => {
          expect(closingReasonsSetting.closingReasons.isPresent).to.be.false;
        });
      });
    });
  });
});
