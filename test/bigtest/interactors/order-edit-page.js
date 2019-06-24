import {
  collection,
  interactor,
  isPresent,
  text,
  value,
} from '@bigtest/interactor';

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
  static defaultScope = '[name="vendor"]';
  value = value();
}

export default interactor(class OrderEditPage {
  static defaultScope = '#pane-poForm';
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }

  title = text('[class*=paneTitleLabel---]');
  suffixSelect = new SuffixSelect();
  renewalsAccordion = isPresent('#renewals');
  orderTypeSelect = new OrderTypeSelect();
  createOrderButton = new Button('#clickable-create-new-purchase-order');
  vendorSelect = new VendorSelect();
  addNoteButton = new Button('[data-test-add-note-button]');
  removeNoteButton = new Button('[data-test-remove-note-button]');
  notes = collection('[name*=notes]');
});
