import React from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
} from '@folio/stripes/components';
import {
  AcqTagsFilter,
  LocationFilter,
  SourceFilter,
  PluggableOrganizationFilter,
} from '@folio/stripes-acq-components';

import OrdersCheckboxFilter from '../common/OrdersCheckboxFilter';
import OrdersDateRangeFilter from '../common/OrdersDateRangeFilter';
import MaterialTypeFilter from '../common/MaterialTypeFilter';
import OrdersTextFilter from '../common/OrdersTextFilter';
import FundFilter from '../common/FundFilter';
import {
  ACQUISITION_METHOD_FILTER_OPTIONS,
  ORDER_FORMAT_FILTER_OPTIONS,
  PAYMENT_STATUS_FILTER_OPTIONS,
  RECEIPT_STATUS_FILTER_OPTIONS,
} from '../OrdersList/constants';
import {
  fundsShape,
  materialTypesShape,
} from '../common/shapes';
import {
  BOOLEAN_OPTIONS,
  FILTERS,
} from './constants';

function OrderLinesFilters({ activeFilters, onChange, funds, materialTypes }) {
  return (
    <AccordionSet>
      <OrdersCheckboxFilter
        activeFilters={activeFilters[FILTERS.RECEIPT_STATUS]}
        closedByDefault={false}
        id={FILTERS.RECEIPT_STATUS}
        labelId="ui-orders.poLine.receiptStatus"
        name={FILTERS.RECEIPT_STATUS}
        onChange={onChange}
        options={RECEIPT_STATUS_FILTER_OPTIONS}
      />
      <OrdersCheckboxFilter
        activeFilters={activeFilters[FILTERS.PAYMENT_STATUS]}
        closedByDefault={false}
        id={FILTERS.PAYMENT_STATUS}
        labelId="ui-orders.poLine.paymentStatus"
        name={FILTERS.PAYMENT_STATUS}
        onChange={onChange}
        options={PAYMENT_STATUS_FILTER_OPTIONS}
      />
      <OrdersCheckboxFilter
        activeFilters={activeFilters[FILTERS.ACQUISITION_METHOD]}
        labelId="ui-orders.poLine.acquisitionMethod"
        name={FILTERS.ACQUISITION_METHOD}
        onChange={onChange}
        options={ACQUISITION_METHOD_FILTER_OPTIONS}
      />
      <LocationFilter
        activeFilters={activeFilters[FILTERS.LOCATION]}
        labelId="ui-orders.line.accordion.location"
        name={FILTERS.LOCATION}
        onChange={onChange}
      />
      <FundFilter
        activeFilters={activeFilters[FILTERS.FUND_CODE]}
        labelId="ui-orders.filter.fundCode"
        name={FILTERS.FUND_CODE}
        onChange={onChange}
        funds={funds}
      />
      <OrdersCheckboxFilter
        activeFilters={activeFilters[FILTERS.ORDER_FORMAT]}
        labelId="ui-orders.poLine.orderFormat"
        name={FILTERS.ORDER_FORMAT}
        onChange={onChange}
        options={ORDER_FORMAT_FILTER_OPTIONS}
      />
      <MaterialTypeFilter
        activeFilters={activeFilters[FILTERS.MATERIAL_TYPE_ELECTRONIC]}
        isElectronic
        name={FILTERS.MATERIAL_TYPE_ELECTRONIC}
        onChange={onChange}
        materialTypes={materialTypes}
      />
      <MaterialTypeFilter
        activeFilters={activeFilters[FILTERS.MATERIAL_TYPE_PHYSICAL]}
        name={FILTERS.MATERIAL_TYPE_PHYSICAL}
        onChange={onChange}
        materialTypes={materialTypes}
      />
      <OrdersDateRangeFilter
        activeFilters={activeFilters[FILTERS.DATE_CREATED]}
        id={FILTERS.DATE_CREATED}
        labelId="ui-orders.poLine.dateCreated"
        name={FILTERS.DATE_CREATED}
        onChange={onChange}
      />
      <PluggableOrganizationFilter
        id={FILTERS.VENDOR}
        activeFilters={activeFilters[FILTERS.VENDOR]}
        labelId="ui-orders.line.accordion.vendor"
        name={FILTERS.VENDOR}
        onChange={onChange}
      />
      <AcqTagsFilter
        activeFilters={activeFilters[FILTERS.TAGS]}
        id={FILTERS.TAGS}
        name={FILTERS.TAGS}
        onChange={onChange}
      />
      <SourceFilter
        activeFilters={activeFilters[FILTERS.SOURCE_CODE]}
        name={FILTERS.SOURCE_CODE}
        onChange={onChange}
      />
      <OrdersCheckboxFilter
        activeFilters={activeFilters[FILTERS.COLLECTION]}
        labelId="ui-orders.filter.collection"
        name={FILTERS.COLLECTION}
        onChange={onChange}
        options={BOOLEAN_OPTIONS}
      />
      <OrdersCheckboxFilter
        activeFilters={activeFilters[FILTERS.RUSH]}
        labelId="ui-orders.filter.rush"
        name={FILTERS.RUSH}
        onChange={onChange}
        options={BOOLEAN_OPTIONS}
      />
      <PluggableOrganizationFilter
        id={FILTERS.ACCESS_PROVIDER}
        activeFilters={activeFilters[FILTERS.ACCESS_PROVIDER]}
        labelId="ui-orders.eresource.accessProvider"
        name={FILTERS.ACCESS_PROVIDER}
        onChange={onChange}
      />
      <OrdersCheckboxFilter
        activeFilters={activeFilters[FILTERS.ACTIVATED]}
        labelId="ui-orders.filter.activated"
        name={FILTERS.ACTIVATED}
        onChange={onChange}
        options={BOOLEAN_OPTIONS}
      />
      <OrdersDateRangeFilter
        activeFilters={activeFilters[FILTERS.EXPECTED_ACTIVATION_DATE]}
        id={FILTERS.EXPECTED_ACTIVATION_DATE}
        labelId="ui-orders.eresource.expectedActivation"
        name={FILTERS.EXPECTED_ACTIVATION_DATE}
        onChange={onChange}
      />
      <OrdersCheckboxFilter
        activeFilters={activeFilters[FILTERS.TRIAL]}
        labelId="ui-orders.filter.trial"
        name={FILTERS.TRIAL}
        onChange={onChange}
        options={BOOLEAN_OPTIONS}
      />
      <OrdersDateRangeFilter
        activeFilters={activeFilters[FILTERS.SUBSCRIPTION_FROM]}
        id={FILTERS.SUBSCRIPTION_FROM}
        labelId="ui-orders.itemDetails.subscriptionFrom"
        name={FILTERS.SUBSCRIPTION_FROM}
        onChange={onChange}
      />
      <OrdersDateRangeFilter
        activeFilters={activeFilters[FILTERS.SUBSCRIPTION_TO]}
        id={FILTERS.SUBSCRIPTION_TO}
        labelId="ui-orders.itemDetails.subscriptionTo"
        name={FILTERS.SUBSCRIPTION_TO}
        onChange={onChange}
      />
      <OrdersDateRangeFilter
        activeFilters={activeFilters[FILTERS.ACTUAL_RECEIPT_DATE]}
        id={FILTERS.ACTUAL_RECEIPT_DATE}
        labelId="ui-orders.filter.actualReceiptDate"
        name={FILTERS.ACTUAL_RECEIPT_DATE}
        onChange={onChange}
      />
      <OrdersDateRangeFilter
        activeFilters={activeFilters[FILTERS.EXPECTED_RECEIPT_DATE]}
        id={FILTERS.EXPECTED_RECEIPT_DATE}
        labelId="ui-orders.physical.expectedReceiptDate"
        name={FILTERS.EXPECTED_RECEIPT_DATE}
        onChange={onChange}
      />
      <OrdersDateRangeFilter
        activeFilters={activeFilters[FILTERS.RECEIPT_DUE]}
        id={FILTERS.RECEIPT_DUE}
        labelId="ui-orders.physical.receiptDue"
        name={FILTERS.RECEIPT_DUE}
        onChange={onChange}
      />
      <OrdersCheckboxFilter
        activeFilters={activeFilters[FILTERS.CLAIM]}
        labelId="ui-orders.filter.claim"
        name={FILTERS.CLAIM}
        onChange={onChange}
        options={BOOLEAN_OPTIONS}
      />
      <OrdersTextFilter
        id={FILTERS.CLAIM_GRACE}
        activeFilters={activeFilters[FILTERS.CLAIM_GRACE]}
        labelId="ui-orders.filter.claimGrace"
        name={FILTERS.CLAIM_GRACE}
        type="number"
        onChange={onChange}
      />
      <OrdersDateRangeFilter
        activeFilters={activeFilters[FILTERS.CLAIM_SENT]}
        id={FILTERS.CLAIM_SENT}
        labelId="ui-orders.filter.claimSent"
        name={FILTERS.CLAIM_SENT}
        onChange={onChange}
      />
    </AccordionSet>
  );
}

OrderLinesFilters.propTypes = {
  onChange: PropTypes.func.isRequired,
  activeFilters: PropTypes.object.isRequired,
  funds: fundsShape,
  materialTypes: materialTypesShape,
};

export default OrderLinesFilters;
