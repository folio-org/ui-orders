import {
  collection,
  interactor,
  is,
  property,
  text,
} from '@bigtest/interactor';

@interactor class ReceivePiecesButton {
  static defaultScope = '[data-test-receive-pieces-button]';
  isButton = is('button');
  isDisabled = property('disabled');
}

@interactor class CloseButton {
  static defaultScope = '[data-test-close-button]';
  isButton = is('button');
}

export default interactor(class ReceivingPage {
  static defaultScope = '[data-test-receiving]';
  textOnPage = text('Receivings List');
  receivePiecesButton = new ReceivePiecesButton();
  closeButton = new CloseButton();
  receivingList = collection('[class*=mclRow---]');
});
