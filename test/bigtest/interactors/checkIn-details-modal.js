import {
  interactor,
  is,
  value,
} from '@bigtest/interactor';

import Button from './button';
import { CheckBox } from './common';

@interactor class BarcodeInput {
  static defaultScope = 'input[type="text"]';
  isInput = is('input');
  value = value();
}

export default interactor(class CheckInDetailsModal {
  static defaultScope = '#data-test-check-in-details-modal';
  checkAll = new CheckBox();
  checkInButton = new Button('[data-test-check-in-button]');
  cancelButton = new Button('[data-test-cancel-button]');
  barcodeInput = new BarcodeInput();
});
