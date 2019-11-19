import {
  clickable,
  collection,
  interactor,
  is,
  value,
} from '@bigtest/interactor';

import { CheckBox } from './common';
import { TIMEOUT } from './const';
import Button from './button';

@interactor class SearchInput {
  static defaultScope = '[data-test-check-in-history-search] input[type="search"]';
  isInput = is('input');
  value = value();
}

@interactor class ConfirmationModal {
  static defaultScope = '[class*=modal---]';
  confirmButton = clickable('[data-test-confirmation-modal-confirm-button]');
  cancelButton = clickable('[data-test-confirmation-modal-cancel-button]');
}

@interactor class CheckAllCheckbox {
  static defaultScope = 'input[name="isAllChecked"]';
}

export default interactor(class CheckInHistoryPage {
  static defaultScope = '[data-test-check-in-history]';
  closeButton = new Button('[data-test-close-button]');
  searchInput = new SearchInput();
  removeButton = new Button('[data-test-check-in-remove]');
  pieces = collection('[class*=mclRow---]', {
    checkPiece: new CheckBox(),
  });

  confirmationModal = new ConfirmationModal();
  checkAllCheckbox = new CheckAllCheckbox();

  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.searchInput.isPresent);
  }
});
