import {
  interactor,
  clickable,
  text,
  isPresent,
} from '@bigtest/interactor';

const OPEN_ORDER_ERROR_MODAL_SELECTORS = {
  root: '[data-test-update-order-error-modal]',
  cancelAction: '[type="button"]',
  reason: '[class^="modalContent"]',
};

export default interactor(class OpenOrderErrorModal {
  static defaultScope = OPEN_ORDER_ERROR_MODAL_SELECTORS.root;
  cancelAction = clickable(OPEN_ORDER_ERROR_MODAL_SELECTORS.cancelAction);
  reason = text(OPEN_ORDER_ERROR_MODAL_SELECTORS.reason);
  isAppear = isPresent(OPEN_ORDER_ERROR_MODAL_SELECTORS.root);
  hasCancelAction = isPresent(OPEN_ORDER_ERROR_MODAL_SELECTORS.cancelAction);
  hasReason = isPresent(OPEN_ORDER_ERROR_MODAL_SELECTORS.reason);
});
