import {
  interactor,
  is,
} from '@bigtest/interactor';

@interactor class CloseButton {
  static defaultScope = '[data-test-close-button]';
  isButton = is('button');
}

export default interactor(class ReceivingHistoryPage {
  static defaultScope = '[data-test-receiving-history]';
  closeButton = new CloseButton();
});
