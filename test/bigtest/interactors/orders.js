import {
  clickable,
  collection,
  fillable,
  interactor,
  isPresent,
  property,
  scoped,
  selectable,
} from '@bigtest/interactor';

import { WORKFLOW_STATUS } from '../../../src/common/constants';
import { FILTERS } from '../../../src/OrdersList';
import Button from './button';
import { TIMEOUT } from './const';

@interactor class OrdersFilterInteractor {
  static defaultScope = '#pane-filter';

  statusOpenChecked = property(`[data-test-checkbox-filter-data-option=${WORKFLOW_STATUS.open}]`, 'checked');
  statusPendingChecked = property(`[data-test-checkbox-filter-data-option=${WORKFLOW_STATUS.pending}]`, 'checked');
  statusClosedChecked = property(`[data-test-checkbox-filter-data-option=${WORKFLOW_STATUS.closed}]`, 'checked');

  fillDateOrderedStart = fillable(`#${FILTERS.DATE_ORDERED} input[name="startDate"]`);
  fillDateOrderedEnd = fillable(`#${FILTERS.DATE_ORDERED} input[name="endDate"]`);
  applyDateOrdered = new Button(`#${FILTERS.DATE_ORDERED} [data-test-apply-button]`);

  fillRenewalReviewPeriod = fillable(`#${FILTERS.RENEWAL_REVIEW_PERIOD} input`);
}

export default interactor(class OrdersInteractor {
  static defaultScope = '[data-test-order-instances]';

  hasCreateOrderButton = isPresent('#clickable-neworder');
  orders = collection('[role=row] a');
  order = scoped('[data-test-order-details]');

  filters = new OrdersFilterInteractor();
  isNoResultsMessageLabelPresent = isPresent('[class*=noResultsMessageLabel]');
  chooseSearchOption= selectable('#input-order-search-qindex');
  fillSearchField = fillable('#input-order-search');
  clickSearch = clickable('[data-test-search-and-sort-submit]');
  listIsLoaded = isPresent('#list-orders');

  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.hasCreateOrderButton);
  }

  whenListLoaded() {
    return this.timeout(TIMEOUT).when(() => this.listIsLoaded);
  }
});
