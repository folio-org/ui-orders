import {
  interactor,
  isPresent,
  collection,
} from '@bigtest/interactor';

import AddClosingReason from './AddClosingReason';
import ClosingReasonItem from './ClosingReasonItem';
import { TIMEOUT } from '../../const';

export default interactor(class ClosingReasons {
  static defaultScope = '[data-test-order-settings-closing-orders]';

  isOrdersListPresent = isPresent('[data-test-order-settings-closing-orders-list]');

  addClosingReason = new AddClosingReason();
  closingReasonItem = new ClosingReasonItem();

  reasons = collection(ClosingReasonItem.defaultScope, ClosingReasonItem);
  systemReasons = collection('[data-test-closing-reason-item-system]', ClosingReasonItem);

  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.iisOrdersListPresentsLoaded);
  }
});
