import {
  collection,
  interactor,
  isPresent,
  scoped,
  fillable,
  property,
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

export default interactor(class OrdersInteractor {
  static defaultScope = '[data-test-order-instances]';

  hasCreateOrderButton = isPresent('#clickable-neworder');
  hasPONumberField = isPresent('[name="poNumber"]');
  hasVendorNameField = isPresent('[name="vendor"]');
  hasCreatedByField = isPresent('[name="createdByName"]');
  orders = collection('[role=row] a');
  order = scoped('[data-test-order-details]');

  filters = new OrdersFilterInteractor();

  whenLoaded() {
    return this.timeout(5000).when(() => this.hasCreateOrderButton);
  }
});
