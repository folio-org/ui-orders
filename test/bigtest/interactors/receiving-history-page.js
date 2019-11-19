import {
  collection,
  interactor,
  is,
  isPresent,
  text,
  value,
} from '@bigtest/interactor';

import { CheckBox } from './common';
import Button from './button';
import { TIMEOUT } from './const';

@interactor class SearchInput {
  static defaultScope = '[data-test-receiving-history-search] input[type="search"]';
  isInput = is('input');
  value = value();
}

@interactor class ConfirmationModal {
  static defaultScope = '[class*=modal---]';
}

export default interactor(class ReceivingHistoryPage {
  static defaultScope = '[data-test-receiving-history]';
  closeButton = new Button('[data-test-close-button]');
  searchInput = new SearchInput();
  removeButton = new Button('[data-test-receiving-remove]');
  pieces = collection('[class*=mclRow---]', {
    checkPiece: new CheckBox(),
  });

  barcodes = collection('[data-test-piece-barcode]', {
    barcode: text(),
  });

  confirmationModal = new ConfirmationModal();
  receivingItemsButton = new Button('[data-test-receiving-items-button]');
  isLoaded = isPresent('[data-test-receiving-history-search]');

  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.isLoaded);
  }
});
