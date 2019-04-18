import {
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

import Button from './button';

export default interactor(class OrderDetailsPage {
  static defaultScope = '[data-test-order-details]';
  title = text('[class*=paneTitleLabel---]');
  closeReasonBlock = isPresent('[data-test-close-reason-block]');
  editOrderButton = new Button('[data-test-order-edit]');
  addLineButton = new Button('[data-test-add-line-button]');
  receivingButton = new Button('[data-test-receiving-button]');
  openOrderButton = new Button('[data-test-open-order-button]');
  closeOrderButton = new Button('[data-test-close-order-button]');
  renewalsAccordion = isPresent('#renewals')
});
