import {
  collection,
  interactor,
  isPresent,
  text,
  value,
} from '@bigtest/interactor';

import { OptionListInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import Button from './button';

@interactor class SuffixSelect {
  static defaultScope = 'select[name="numberSuffix"]';
  value = value();
}

@interactor class OrderTypeSelect {
  static defaultScope = 'select[name="orderType"]';
  value = value();
}

@interactor class VendorSelect {
  button = new Button('[name="vendor"]');
  options = new OptionListInteractor('#sl-po-vendor');
}

@interactor class OrderTemplate {
  options = new OptionListInteractor('#sl-order-template');
  template = new Button('[name="template"]');
}

export default interactor(class OrderEditPage {
  static defaultScope = '#pane-poForm';
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }

  title = text('[class*=paneTitleLabel---]');
  hasTemplateField = isPresent('[name="template"]');
  orderTemplate = new OrderTemplate();
  hasPONumberField = isPresent('[name="poNumber"]');
  hasVendorNameField = isPresent('[name="vendor"]');
  hasCreatedByField = isPresent('[name="createdByName"]');
  suffixSelect = new SuffixSelect();
  renewalsAccordion = isPresent('#renewals');
  orderTypeSelect = new OrderTypeSelect();
  createOrderButton = new Button('#clickable-create-new-purchase-order');
  vendorSelect = new VendorSelect();
  addNoteButton = new Button('[data-test-add-note-button]');
  removeNoteButton = new Button('[data-test-remove-note-button]');
  notes = collection('[name*=notes]');
});
