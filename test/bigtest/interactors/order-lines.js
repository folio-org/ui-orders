import {
  collection,
  fillable,
  interactor,
  isPresent,
  selectable,
} from '@bigtest/interactor';

import Button from './button';
import { FILTERS } from '../../../src/OrderLinesList/constants';
import { TIMEOUT } from './const';

@interactor class FilterAccordion {
  isExpanded = isPresent('[class*=expanded---]');
}

@interactor class OrderLinesFilterInteractor {
  static defaultScope = '[data-test-filter-pane]';

  accordionCreatedDate = new FilterAccordion(`#${FILTERS.DATE_CREATED}`);
  accordionPaymentStatus = new FilterAccordion(`#${FILTERS.PAYMENT_STATUS}`);
  accordionReceiptStatus = new FilterAccordion(`#${FILTERS.RECEIPT_STATUS}`);

  fillCreatedDateStart = fillable('input[name="startDate"]');
  fillCreatedDateEnd = fillable('input[name="endDate"]');
  applyCreatedDate = new Button('[data-test-apply-button]');
  selectSearchOption = selectable('#input-record-search-qindex');
  searchInput = fillable('#input-record-search');
  searchButton = new Button('[data-test-single-search-form-submit]');
}

@interactor class OrdersNavigation {
  static defaultScope = '[data-test-orders-navigation]';
}

export default interactor(class OrderLinesInteractor {
  static defaultScope = '[data-test-order-line-instances]';

  instances = collection('[data-row-inner]');

  navigation = new OrdersNavigation();

  filter = new OrderLinesFilterInteractor();
  isLoaded = isPresent('[data-test-results-pane]');
  isNoResultsMessageLabelPresent = isPresent('[class*=noResultsMessageLabel]');

  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.isLoaded);
  }
});
