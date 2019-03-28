import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import SettingCreateInventoryInteractor from '../interactors/setting-create-inventory';

describe('Setting for Create Inventory', () => {
  const setting = new SettingCreateInventoryInteractor();

  setupApplication();

  beforeEach(function () {
    this.visit('/settings/orders/create-inventory');
  });

  it('renders Setting for Create Inventory', () => {
    expect(setting.isPresent).to.be.true;
  });

  it('displays disabled Save Button', () => {
    expect(setting.saveButton.isButton).to.be.true;
    expect(setting.saveButton.isDisabled).to.be.true;
  });

  it('displays Select fields', () => {
    expect(setting.eresourcesSelect.isSelect).to.be.true;
    expect(setting.physicalSelect.isSelect).to.be.true;
    expect(setting.otherSelect.isSelect).to.be.true;
  });

  it('displays Title', () => {
    expect(setting.title).to.equal('Create Inventory');
  });
});
