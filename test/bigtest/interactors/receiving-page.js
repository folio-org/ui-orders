import {
  collection,
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

import Button from './button';
import { CheckBox } from './common';
import { TIMEOUT } from './const';

export default interactor(class ReceivingPage {
  static defaultScope = '[data-test-receiving]';
  textOnPage = text('Receivings List');
  receivePiecesButton = new Button('[data-test-receive-pieces-button]');
  closeButton = new Button('[data-test-close-button]');
  receivingList = collection('[class*=mclRow---]', {
    checkLine: new CheckBox('input[name*=check-line-]'),
  });

  checkAll = new CheckBox();
  receivingHistoryButton = new Button('[data-test-receiving-history-button]');

  isLoaded = isPresent('[data-test-receive-pieces-button]');

  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.isLoaded);
  }
});
