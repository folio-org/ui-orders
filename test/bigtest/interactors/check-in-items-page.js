import {
  collection,
  interactor,
  is,
  isPresent,
  value,
} from '@bigtest/interactor';

import Button from './button';
import { CheckBox } from './common';
import { TIMEOUT } from './const';

@interactor class SearchInput {
  static defaultScope = '[data-test-check-in-items-search] input[type="search"]';
  isInput = is('input');
  value = value();
}

export default interactor(class CheckInItemsPage {
  static defaultScope = '[data-test-check-in-items-wrapper]';
  addPieceButton = new Button('[data-test-check-in-items-add-piece-button]');
  checkInButton = new Button('[data-test-check-in-items-check-in-button]');
  closeButton = new Button('[data-test-close-button]');
  pieces = collection('[class*=mclRow---]', {
    checkPiece: new CheckBox(),
    actions: new Button('#check-in-actions'),
  });

  deletePieceButton = new Button('[data-test-button-delete-piece]');

  searchInput = new SearchInput();
  isLoaded = isPresent('[data-test-check-in-items]');
  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.isLoaded);
  }
});
