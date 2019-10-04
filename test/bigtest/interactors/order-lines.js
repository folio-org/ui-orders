import {
  clickable,
  collection,
  fillable,
  interactor,
  isPresent,
  selectable,
} from '@bigtest/interactor';

import Button from './button';
import { FILTERS } from '../../../src/OrderLinesList/constants';

@interactor class FilterAccordion {
  isExpanded = isPresent('[class*=expanded---]');
}

@interactor class OrderLinesFilterInteractor {
  static defaultScope = '#pane-filter';

  accordionCreatedDate = new FilterAccordion(`#${FILTERS.DATE_CREATED}`);
  accordionPaymentStatus = new FilterAccordion(`#${FILTERS.PAYMENT_STATUS}`);
  accordionReceiptStatus = new FilterAccordion(`#${FILTERS.RECEIPT_STATUS}`);

  fillCreatedDateStart = fillable('input[name="startDate"]');
  fillCreatedDateEnd = fillable('input[name="endDate"]');
  applyCreatedDate = new Button('[data-test-apply-button]');
  selectSearchOption = selectable('#input-order-line-search-qindex');
  searchInput = fillable('#input-order-line-search');
  searchButton = new Button('[data-test-search-and-sort-submit]');
}

@interactor class OrdersNavigation {
  static defaultScope = '[data-test-orders-navigation]';
}

export default interactor(class OrderLinesInteractor {
  static defaultScope = '[data-test-order-line-instances]';

  instances = collection('[role=row] a');

  navigation = new OrdersNavigation();

  filter = new OrderLinesFilterInteractor();
  isLoaded = isPresent('#pane-results');
  isNoResultsMessageLabelPresent = isPresent('[class*=noResultsMessageLabel]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
