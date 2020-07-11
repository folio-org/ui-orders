import {
  collection,
  interactor,
  isPresent,
  text,
  value,
  clickable,
  fillable,
} from '@bigtest/interactor';

import { OptionListInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import Button from './button';

@interactor class SuffixSelect {
  static defaultScope = 'select[name="poNumberSuffix"]';
  value = value();
}

@interactor class OrderTypeSelect {
  static defaultScope = 'select[name="orderType"]';
  value = value();
}

@interactor class OrderTemplate {
  options = new OptionListInteractor('#sl-order-template');
  template = new Button('[name="template"]');
}

@interactor class OngoingInfoAccordion {
  static defaultScope = '#ongoing';
  clickIsSubscriptionCheckbox = clickable('[data-test-checkbox] label');
  renewalInterval = isPresent('[name="ongoing.interval"]')
}

export default interactor(class OrderEditPage {
  static defaultScope = '#pane-poForm';
  isLoaded = isPresent('#paneHeaderpane-poForm');
  whenLoaded() {
    return this.timeout(20000).when(() => this.isLoaded);
  }

  title = text('[class*=paneTitleLabel---]');
  hasTemplateField = isPresent('[name="template"]');
  orderTemplate = new OrderTemplate();
  hasPONumberField = isPresent('[name="poNumber"]');
  hasVendorNameField = isPresent('[name="vendor"]');
  hasCreatedByField = isPresent('[data-test-created-by-name] [data-test-kv-value]');
  suffixSelect = new SuffixSelect();
  isOngoingInfoOpen = isPresent(OngoingInfoAccordion.defaultScope)
  renewalsAccordion = new OngoingInfoAccordion();
  orderTypeSelect = new OrderTypeSelect();
  createOrderButton = new Button('#clickable-create-new-purchase-order');
  fillVendor = fillable('[name="vendor"]');
  addNoteButton = new Button('[data-test-add-note-button]');
  removeNoteButton = new Button('[data-test-remove-note-button]');
  notes = collection('[name*=notes]');
});
