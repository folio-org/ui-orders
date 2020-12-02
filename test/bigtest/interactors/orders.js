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
  static defaultScope = '[data-test-filter-pane]';

  statusOpenChecked = property(`[data-test-checkbox-filter-data-option=${WORKFLOW_STATUS.open}]`, 'checked');
  statusPendingChecked = property(`[data-test-checkbox-filter-data-option=${WORKFLOW_STATUS.pending}]`, 'checked');
  statusClosedChecked = property(`[data-test-checkbox-filter-data-option=${WORKFLOW_STATUS.closed}]`, 'checked');

  fillDateOrderedStart = fillable(`#${FILTERS.DATE_ORDERED} input[name="startDate"]`);
  fillDateOrderedEnd = fillable(`#${FILTERS.DATE_ORDERED} input[name="endDate"]`);
  applyDateOrdered = new Button(`#${FILTERS.DATE_ORDERED} [data-test-apply-button]`);

  expandRenewalReviewPeriod = clickable('#accordion-toggle-button-order-reviewPeriod');
  fillRenewalReviewPeriod = fillable('#order-reviewPeriod input');
}

export default interactor(class OrdersInteractor {
  static defaultScope = '[data-test-order-instances]';

  hasActionMenu = isPresent('#orders-list-actions');
  orders = collection('[data-row-inner]');
  order = scoped('[data-test-order-details]');

  filters = new OrdersFilterInteractor();
  isNoResultsMessageLabelPresent = isPresent('[class*=noResultsMessageLabel]');
  chooseSearchOption= selectable('#input-record-search-qindex');
  fillSearchField = fillable('#input-record-search');
  clickSearch = clickable('[data-test-single-search-form-submit]');
  listIsLoaded = isPresent('[data-test-results-pane]');

  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.hasCreateOrderButton);
  }

  whenListLoaded() {
    return this.timeout(TIMEOUT).when(() => this.listIsLoaded);
  }

  whenRenewalReviewFilterISLoaded() {
    return this.timeout(TIMEOUT).when(() => isPresent('#accordion-toggle-button-order-reviewPeriod'));
  }
});
