import {
  interactor,
  clickable,
  isPresent,
} from '@bigtest/interactor';

const SUBMIT_BUTTON_SELECTOR = '[data-test-open-order-confirmation-modal-submit]';
const CANCEL_BUTTON_SELECTOR = '[data-test-open-order-confirmation-modal-cancel]';
const CONTENT_SELECTOR = '[data-test-open-order-confirmation-modal-content]';

export default interactor(class OpenOrderConfirmationModal {
  static defaultScope = '[data-test-open-order-confirmation-modal]';
  hasSubmitButton = isPresent(SUBMIT_BUTTON_SELECTOR);
  hasCancelButton = isPresent(CANCEL_BUTTON_SELECTOR);
  hasContent = isPresent(CONTENT_SELECTOR);
  cancelAction = clickable(CANCEL_BUTTON_SELECTOR)
  submitAction = clickable(SUBMIT_BUTTON_SELECTOR);
});
