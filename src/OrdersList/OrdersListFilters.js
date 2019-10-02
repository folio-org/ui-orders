import React from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
} from '@folio/stripes/components';
import {
  AcqUnitFilter,
  acqUnitsShape,
} from '@folio/stripes-acq-components';

import ClosingReasonFilter from '../common/ClosingReasonFilter';
import OrdersCheckboxFilter from '../common/OrdersCheckboxFilter';
import OrdersDateRangeFilter from '../common/OrdersDateRangeFilter';
import OrdersTextFilter from '../common/OrdersTextFilter';
import UserFilter from '../common/UserFilter';
import VendorFilter from '../common/VendorFilter';
import {
  closingReasonsShape,
  usersShape,
  vendorsShape,
} from '../common/shapes';
import { BOOLEAN_OPTIONS } from '../OrderLinesList/constants';
import {
  FILTERS,
  STATUS_FILTER_OPTIONS,
  ORDER_TYPE_FILTER_OPTIONS,
} from './constants';

function OrdersListFilters({ activeFilters, closingReasons, onChange, vendors, users, acqUnits }) {
  return (
    <AccordionSet>
      <OrdersCheckboxFilter
        id={FILTERS.STATUS}
        activeFilters={activeFilters[FILTERS.STATUS]}
        labelId="ui-orders.workflowStatus"
        name={FILTERS.STATUS}
        onChange={onChange}
        options={STATUS_FILTER_OPTIONS}
        closedByDefault={false}
      />
      <OrdersCheckboxFilter
        id={FILTERS.APPROVED}
        activeFilters={activeFilters[FILTERS.APPROVED]}
        labelId="ui-orders.orderSummary.approved"
        name={FILTERS.APPROVED}
        onChange={onChange}
        options={BOOLEAN_OPTIONS}
      />
      <AcqUnitFilter
        id={FILTERS.ACQUISITIONS_UNIT}
        activeFilters={activeFilters[FILTERS.ACQUISITIONS_UNIT]}
        labelId="ui-orders.order.acquisitionsUnit"
        name={FILTERS.ACQUISITIONS_UNIT}
        onChange={onChange}
        acqUnits={acqUnits}
      />
      <UserFilter
        id={FILTERS.ASSIGNED_TO}
        activeFilters={activeFilters[FILTERS.ASSIGNED_TO]}
        labelId="ui-orders.orderDetails.assignedTo"
        name={FILTERS.ASSIGNED_TO}
        onChange={onChange}
        users={users}
      />
      <UserFilter
        id={FILTERS.CREATED_BY}
        activeFilters={activeFilters[FILTERS.CREATED_BY]}
        labelId="ui-orders.orderDetails.createdBy"
        name={FILTERS.CREATED_BY}
        onChange={onChange}
        users={users}
      />
      <OrdersDateRangeFilter
        id={FILTERS.DATE_CREATED}
        activeFilters={activeFilters[FILTERS.DATE_CREATED]}
        labelId="ui-orders.filter.dateCreated"
        name={FILTERS.DATE_CREATED}
        onChange={onChange}
      />
      <OrdersDateRangeFilter
        id={FILTERS.DATE_ORDERED}
        activeFilters={activeFilters[FILTERS.DATE_ORDERED]}
        labelId="ui-orders.dateOrdered"
        name={FILTERS.DATE_ORDERED}
        onChange={onChange}
      />
      <OrdersCheckboxFilter
        id={FILTERS.ORDER_TYPE}
        activeFilters={activeFilters[FILTERS.ORDER_TYPE]}
        labelId="ui-orders.order.orderType"
        name={FILTERS.ORDER_TYPE}
        onChange={onChange}
        options={ORDER_TYPE_FILTER_OPTIONS}
      />
      <VendorFilter
        id={FILTERS.VENDOR}
        activeFilters={activeFilters[FILTERS.VENDOR]}
        labelId="ui-orders.line.accordion.vendor"
        name={FILTERS.VENDOR}
        onChange={onChange}
        vendors={vendors}
      />
      <ClosingReasonFilter
        id={FILTERS.CLOSE_REASON}
        activeFilters={activeFilters[FILTERS.CLOSE_REASON]}
        labelId="ui-orders.orderSummary.closingReason"
        name={FILTERS.CLOSE_REASON}
        onChange={onChange}
        closingReasons={closingReasons}
      />
      <OrdersCheckboxFilter
        id={FILTERS.RE_ENCUMBER}
        activeFilters={activeFilters[FILTERS.RE_ENCUMBER]}
        labelId="ui-orders.orderDetails.reEncumber"
        name={FILTERS.RE_ENCUMBER}
        onChange={onChange}
        options={BOOLEAN_OPTIONS}
      />
      <OrdersDateRangeFilter
        id={FILTERS.RENEWAL_DATE}
        activeFilters={activeFilters[FILTERS.RENEWAL_DATE]}
        labelId="ui-orders.renewal.date"
        name={FILTERS.RENEWAL_DATE}
        onChange={onChange}
      />
      <OrdersCheckboxFilter
        id={FILTERS.MANUAL_RENEWAL}
        activeFilters={activeFilters[FILTERS.MANUAL_RENEWAL]}
        labelId="ui-orders.renewal.manualRenewal"
        name={FILTERS.MANUAL_RENEWAL}
        onChange={onChange}
        options={BOOLEAN_OPTIONS}
      />
      <OrdersTextFilter
        id={FILTERS.OrdersListFiltersRENEWAL_REVIEW_PERIOD}
        activeFilterOrdersListFilterss={activeFilters[FILTERS.RENEWAL_REVIEW_PERIOD]}
        labelId="ui-OrdersListFiltersorders.renewal.reviewPeriod"
        name={FILTERS.RENEWAL_REVIEW_PERIOD}
        type="number"
        onChange={onChange}
      />
    </AccordionSet>
  );
}

OrdersListFilters.propTypes = {
  activeFilters: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  vendors: vendorsShape,
  closingReasons: closingReasonsShape,
  users: usersShape,
  acqUnits: acqUnitsShape,
};

OrdersListFilters.defaultProps = {
  activeFilters: {
    [FILTERS.APPROVED]: [],
    [FILTERS.ASSIGNED_TO]: [],
    [FILTERS.CLOSE_REASON]: [],
    [FILTERS.CREATED_BY]: [],
    [FILTERS.DATE_CREATED]: [],
    [FILTERS.DATE_ORDERED]: [],
    [FILTERS.MANUAL_RENEWAL]: [],
    [FILTERS.ORDER_TYPE]: [],
    [FILTERS.RE_ENCUMBER]: [],
    [FILTERS.RENEWAL_DATE]: [],
    [FILTERS.RENEWAL_REVIEW_PERIOD]: [],
    [FILTERS.STATUS]: [],
    [FILTERS.VENDOR]: [],
  },
};

export default OrdersListFilters;
