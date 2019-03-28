import {
  interactor,
  is,
  property,
  text,
} from '@bigtest/interactor';

@interactor class SaveButton {
  static defaultScope = '#clickable-save-config';
  isButton = is('button');
  isDisabled = property('disabled');
}

@interactor class EresourcesSelect {
  static defaultScope = '[name="eresource"]';
  isSelect = is('select');
}

@interactor class PhysicalSelect {
  static defaultScope = '[name="physical"]';
  isSelect = is('select');
}

@interactor class OtherSelect {
  static defaultScope = '[name="other"]';
  isSelect = is('select');
}

export default interactor(class SettingCreateInventoryInteractor {
  static defaultScope = '[data-test-order-settings-create-inventory]';
  saveButton = new SaveButton();
  eresourcesSelect = new EresourcesSelect();
  physicalSelect = new PhysicalSelect();
  otherSelect = new OtherSelect();
  title = text('[class*=paneTitleLabel---]');
});
