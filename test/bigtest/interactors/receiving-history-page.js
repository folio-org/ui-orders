import {
  collection,
  interactor,
  is,
  property,
  value,
  text,
} from '@bigtest/interactor';

@interactor class SearchInput {
  static defaultScope = '[data-test-receiving-history-search] input[type="search"]';
  isInput = is('input');
  value = value();
}

@interactor class RemoveButton {
  static defaultScope = '[data-test-receiving-remove]';
  isButton = is('button');
  isDisabled = property('disabled');
}

@interactor class ConfirmationModal {
  static defaultScope = '[class*=modal---]';
}

@interactor class CloseButton {
  static defaultScope = '[data-test-close-button]';
  isButton = is('button');
}

export default interactor(class ReceivingHistoryPage {
  static defaultScope = '[data-test-receiving-history]';
  closeButton = new CloseButton();
  searchInput = new SearchInput();
  removeButton = new RemoveButton();
  pieces = collection('[class*=mclRow---]');
  barcodes = collection('[data-test-piece-barcode]', {
    barcode: text(),
  });

  confirmationModal = new ConfirmationModal();
});
