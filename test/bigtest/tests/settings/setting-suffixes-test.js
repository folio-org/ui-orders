import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ConfirmationInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import setupApplication from '../../helpers/setup-application';
import SuffixesInteractor from '../../interactors/settings/setting-suffixes';

describe('Setting of Closing Reasons', function () {
  setupApplication();

  const suffixesSetting = new SuffixesInteractor();
  const deleteConfirmation = new ConfirmationInteractor('#delete-controlled-vocab-entry-confirmation');

  beforeEach(async function () {
    this.visit('/settings/orders/suffixes');
    await suffixesSetting.whenLoaded();
  });

  it('should be rendered', () => {
    expect(suffixesSetting.isPresent).to.be.true;
    expect(suffixesSetting.suffixes.isPresent).to.be.false;
  });

  describe('Add new suffix', function () {
    beforeEach(async function () {
      await suffixesSetting.addSuffixBtn.click();
      await suffixesSetting.whenLoaded();
    });

    it('renders fields for new suffix', () => {
      expect(suffixesSetting.suffixes.list(0).saveButton.isPresent).to.be.true;
      expect(suffixesSetting.suffixes.list(0).cancelButton.isPresent).to.be.true;
    });

    describe('Cancel add new suffix', function () {
      beforeEach(async function () {
        await suffixesSetting.suffixes.list(0).cancelButton.click();
        await suffixesSetting.whenLoaded();
      });

      it('renders fields for new suffix', () => {
        expect(suffixesSetting.suffixes.isPresent).to.be.false;
      });
    });

    describe('Save new suffix', function () {
      beforeEach(async function () {
        await suffixesSetting.suffixes.list(0).nameInput.fill('test');
        await suffixesSetting.suffixes.list(0).saveButton.click();
        await suffixesSetting.whenLoaded();
      });

      it('renders saved suffix', () => {
        expect(suffixesSetting.suffixes.list().length).to.equal(1);
      });

      describe('Edit suffix', function () {
        beforeEach(async function () {
          await suffixesSetting.suffixes.list(0).editButton.click();
          await suffixesSetting.suffixes.list(0).nameInput.fill('test new');
          await suffixesSetting.suffixes.list(0).saveButton.click();
          await suffixesSetting.whenLoaded();
        });

        it('renders edited suffix', () => {
          expect(suffixesSetting.suffixes.list().length).to.equal(1);
        });
      });

      describe('Delete suffix', function () {
        beforeEach(async function () {
          await suffixesSetting.suffixes.list(0).deleteButton.click();
          await deleteConfirmation.confirm();
          await suffixesSetting.whenLoaded();
        });

        it('does not render empty list', () => {
          expect(suffixesSetting.suffixes.isPresent).to.be.false;
        });
      });
    });
  });
});
