import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
} from '@folio/stripes/components';
import {
  AcqCheckboxFilter,
  AcqDateRangeFilter,
  AcqTagsFilter,
  AcqUnitFilter,
  BooleanFilter,
  PluggableOrganizationFilter,
  PluggableUserFilter,
} from '@folio/stripes-acq-components';

import ClosingReasonFilter from '../common/ClosingReasonFilter';
import OrdersTextFilter from '../common/OrdersTextFilter';
import {
  closingReasonsShape,
} from '../common/shapes';
import {
  FILTERS,
  STATUS_FILTER_OPTIONS,
  ORDER_TYPE_FILTER_OPTIONS,
} from './constants';

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);

function OrdersListFilters({ activeFilters, closingReasons, applyFilters, disabled }) {
  const onChange = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  return (
    <AccordionSet>
      <AcqCheckboxFilter
        id={FILTERS.STATUS}
        activeFilters={activeFilters[FILTERS.STATUS]}
        labelId="ui-orders.workflowStatus"
        name={FILTERS.STATUS}
        onChange={onChange}
        options={STATUS_FILTER_OPTIONS}
        closedByDefault={false}
        disabled={disabled}
      />
      <BooleanFilter
        id={FILTERS.APPROVED}
        activeFilters={activeFilters[FILTERS.APPROVED]}
        labelId="ui-orders.orderSummary.approved"
        name={FILTERS.APPROVED}
        onChange={onChange}
        disabled={disabled}
      />
      <AcqUnitFilter
        id={FILTERS.ACQUISITIONS_UNIT}
        activeFilters={activeFilters[FILTERS.ACQUISITIONS_UNIT]}
        labelId="ui-orders.order.acquisitionsUnit"
        name={FILTERS.ACQUISITIONS_UNIT}
        onChange={onChange}
        disabled={disabled}
      />
      <PluggableUserFilter
        id={FILTERS.ASSIGNED_TO}
        activeFilters={activeFilters[FILTERS.ASSIGNED_TO]}
        labelId="ui-orders.orderDetails.assignedTo"
        name={FILTERS.ASSIGNED_TO}
        onChange={onChange}
        disabled={disabled}
      />
      <PluggableUserFilter
        id={FILTERS.CREATED_BY}
        activeFilters={activeFilters[FILTERS.CREATED_BY]}
        labelId="ui-orders.orderDetails.createdBy"
        name={FILTERS.CREATED_BY}
        onChange={onChange}
        disabled={disabled}
      />
      <AcqDateRangeFilter
        id={FILTERS.DATE_CREATED}
        activeFilters={activeFilters[FILTERS.DATE_CREATED]}
        labelId="ui-orders.filter.dateCreated"
        name={FILTERS.DATE_CREATED}
        onChange={onChange}
        disabled={disabled}
      />
      <AcqDateRangeFilter
        id={FILTERS.DATE_ORDERED}
        activeFilters={activeFilters[FILTERS.DATE_ORDERED]}
        labelId="ui-orders.dateOrdered"
        name={FILTERS.DATE_ORDERED}
        onChange={onChange}
        disabled={disabled}
      />
      <AcqCheckboxFilter
        id={FILTERS.ORDER_TYPE}
        activeFilters={activeFilters[FILTERS.ORDER_TYPE]}
        labelId="ui-orders.order.orderType"
        name={FILTERS.ORDER_TYPE}
        onChange={onChange}
        options={ORDER_TYPE_FILTER_OPTIONS}
        disabled={disabled}
      />
      <PluggableOrganizationFilter
        id={`filter-${FILTERS.VENDOR}`}
        activeFilters={activeFilters[FILTERS.VENDOR]}
        labelId="ui-orders.line.accordion.vendor"
        name={FILTERS.VENDOR}
        onChange={onChange}
        disabled={disabled}
      />
      <AcqTagsFilter
        activeFilters={activeFilters[FILTERS.TAGS]}
        id={FILTERS.TAGS}
        name={FILTERS.TAGS}
        onChange={onChange}
        disabled={disabled}
      />
      <ClosingReasonFilter
        id={FILTERS.CLOSE_REASON}
        activeFilters={activeFilters[FILTERS.CLOSE_REASON]}
        labelId="ui-orders.orderSummary.closingReason"
        name={FILTERS.CLOSE_REASON}
        onChange={onChange}
        closingReasons={closingReasons}
        disabled={disabled}
      />
      <BooleanFilter
        id={FILTERS.RE_ENCUMBER}
        activeFilters={activeFilters[FILTERS.RE_ENCUMBER]}
        labelId="ui-orders.orderDetails.reEncumber"
        name={FILTERS.RE_ENCUMBER}
        onChange={onChange}
        disabled={disabled}
      />
      <AcqDateRangeFilter
        id={FILTERS.RENEWAL_DATE}
        activeFilters={activeFilters[FILTERS.RENEWAL_DATE]}
        labelId="ui-orders.renewal.date"
        name={FILTERS.RENEWAL_DATE}
        onChange={onChange}
        disabled={disabled}
      />
      <BooleanFilter
        id={FILTERS.MANUAL_RENEWAL}
        activeFilters={activeFilters[FILTERS.MANUAL_RENEWAL]}
        labelId="ui-orders.renewal.manualRenewal"
        name={FILTERS.MANUAL_RENEWAL}
        onChange={onChange}
        disabled={disabled}
      />
      <OrdersTextFilter
        id="order-reviewPeriod"
        activeFilters={activeFilters[FILTERS.RENEWAL_REVIEW_PERIOD]}
        labelId="ui-orders.renewal.reviewPeriod"
        name={FILTERS.RENEWAL_REVIEW_PERIOD}
        type="number"
        onChange={onChange}
        disabled={disabled}
      />
    </AccordionSet>
  );
}

OrdersListFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  closingReasons: closingReasonsShape,
  disabled: PropTypes.bool.isRequired,
};

export default OrdersListFilters;
