import {
  clickable,
  collection,
  fillable,
  interactor,
  is,
  isPresent,
  property,
  scoped,
  selectable,
  text,
  value,
} from '@bigtest/interactor';

import { WORKFLOW_STATUS } from '../../../src/components/PurchaseOrder/Summary/FieldWorkflowStatus';
import { FILTERS } from '../../../src/OrdersList';

import Button from './button';

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

@interactor class OrderTemplateInteractor {
  text = text();
  click = clickable();
}

@interactor class OrderTemplateListInteractor {
  list = collection('li', OrderTemplateInteractor);
}

@interactor class OrderTemplate {
  options = new OrderTemplateListInteractor('#sl-order-template');
  template = new Button('[name="template"]');
}

@interactor class OrderType {
  static defaultScope = '[name="orderType"]';
  isSelect = is('select');
  value = value();
}

export default interactor(class OrdersInteractor {
  static defaultScope = '[data-test-order-instances]';

  hasCreateOrderButton = isPresent('#clickable-neworder');
  hasTemplateField = isPresent('[name="template"]');
  orderTemplate = new OrderTemplate();
  hasPONumberField = isPresent('[name="poNumber"]');
  hasVendorNameField = isPresent('[name="vendor"]');
  hasCreatedByField = isPresent('[name="createdByName"]');
  orderType = new OrderType();
  orders = collection('[role=row] a');
  order = scoped('[data-test-order-details]');

  filters = new OrdersFilterInteractor();
  isNoResultsMessageLabelPresent = isPresent('[class*=noResultsMessageLabel]');
  chooseSearchOption= selectable('#input-order-search-qindex');
  fillSearchField = fillable('#input-order-search');
  clickSearch = clickable('[data-test-search-and-sort-submit]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.hasCreateOrderButton);
  }
});
