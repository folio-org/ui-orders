import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ConfirmationInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import setupApplication from '../../helpers/setup-application';
import PrefixesInteractor from '../../interactors/settings/setting-prefixes';

describe('Setting of Closing Reasons', function () {
  setupApplication();

  const prefixesSetting = new PrefixesInteractor();
  const deleteConfirmation = new ConfirmationInteractor('#delete-controlled-vocab-entry-confirmation');

  beforeEach(async function () {
    this.visit('/settings/orders/prefixes');
    await prefixesSetting.whenLoaded();
  });

  it('should be rendered', () => {
    expect(prefixesSetting.isPresent).to.be.true;
    expect(prefixesSetting.prefixes.isPresent).to.be.false;
  });

  describe('Add new prefix', function () {
    beforeEach(async function () {
      await prefixesSetting.addPrefixBtn.click();
      await prefixesSetting.whenLoaded();
    });

    it('renders fields for new prefix', () => {
      expect(prefixesSetting.prefixes.list(0).saveButton.isPresent).to.be.true;
      expect(prefixesSetting.prefixes.list(0).cancelButton.isPresent).to.be.true;
    });

    describe('Cancel add new prefix', function () {
      beforeEach(async function () {
        await prefixesSetting.prefixes.list(0).cancelButton.click();
        await prefixesSetting.whenLoaded();
      });

      it('renders fields for new prefix', () => {
        expect(prefixesSetting.prefixes.isPresent).to.be.false;
      });
    });

    describe('Save new prefix', function () {
      beforeEach(async function () {
        await prefixesSetting.prefixes.list(0).nameInput.fill('test');
        await prefixesSetting.prefixes.list(0).saveButton.click();
        await prefixesSetting.whenLoaded();
      });

      it('renders saved prefix', () => {
        expect(prefixesSetting.prefixes.list().length).to.equal(1);
      });

      describe('Edit prefix', function () {
        beforeEach(async function () {
          await prefixesSetting.prefixes.list(0).editButton.click();
          await prefixesSetting.prefixes.list(0).nameInput.fill('test new');
          await prefixesSetting.prefixes.list(0).saveButton.click();
          await prefixesSetting.whenLoaded();
        });

        it('renders edited prefix', () => {
          expect(prefixesSetting.prefixes.list().length).to.equal(1);
        });
      });

      describe('Delete prefix', function () {
        beforeEach(async function () {
          await prefixesSetting.prefixes.list(0).deleteButton.click();
          await deleteConfirmation.confirm();
          await prefixesSetting.whenLoaded();
        });

        it('does not render empty list', () => {
          expect(prefixesSetting.prefixes.isPresent).to.be.false;
        });
      });
    });
  });
});
