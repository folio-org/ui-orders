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
  LocationFilterContainer,
  PluggableOrganizationFilter,
  SourceFilter,
} from '@folio/stripes-acq-components';

import MaterialTypeFilter from '../common/MaterialTypeFilter';
// import OrdersTextFilter from '../common/OrdersTextFilter';
import PrefixFilter from '../common/PrefixFilter';
import SuffixFilter from '../common/SuffixFilter';
import FundFilter from '../common/FundFilter';
import {
  ACQUISITION_METHOD_FILTER_OPTIONS,
  ORDER_FORMAT_FILTER_OPTIONS,
  PAYMENT_STATUS_FILTER_OPTIONS,
  RECEIPT_STATUS_FILTER_OPTIONS,
} from '../OrdersList/constants';
import {
  materialTypesShape,
} from '../common/shapes';
import { FILTERS } from './constants';

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);

function OrderLinesFilters({ activeFilters, applyFilters, disabled, materialTypes }) {
  const onChange = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  return (
    <AccordionSet>
      <AcqCheckboxFilter
        activeFilters={activeFilters[FILTERS.RECEIPT_STATUS]}
        closedByDefault={false}
        disabled={disabled}
        id={FILTERS.RECEIPT_STATUS}
        labelId="ui-orders.poLine.receiptStatus"
        name={FILTERS.RECEIPT_STATUS}
        onChange={onChange}
        options={RECEIPT_STATUS_FILTER_OPTIONS}
      />
      <AcqCheckboxFilter
        activeFilters={activeFilters[FILTERS.PAYMENT_STATUS]}
        closedByDefault={false}
        disabled={disabled}
        id={FILTERS.PAYMENT_STATUS}
        labelId="ui-orders.poLine.paymentStatus"
        name={FILTERS.PAYMENT_STATUS}
        onChange={onChange}
        options={PAYMENT_STATUS_FILTER_OPTIONS}
      />
      <PrefixFilter
        id={FILTERS.PREFIX}
        activeFilters={activeFilters[FILTERS.PREFIX]}
        labelId="ui-orders.orderDetails.orderNumberPrefix"
        name={FILTERS.PREFIX}
        onChange={onChange}
        disabled={disabled}
      />
      <SuffixFilter
        id={FILTERS.SUFFIX}
        activeFilters={activeFilters[FILTERS.SUFFIX]}
        labelId="ui-orders.orderDetails.orderNumberSuffix"
        name={FILTERS.SUFFIX}
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
      <AcqCheckboxFilter
        activeFilters={activeFilters[FILTERS.ACQUISITION_METHOD]}
        disabled={disabled}
        id={FILTERS.ACQUISITION_METHOD}
        labelId="ui-orders.poLine.acquisitionMethod"
        name={FILTERS.ACQUISITION_METHOD}
        onChange={onChange}
        options={ACQUISITION_METHOD_FILTER_OPTIONS}
      />
      <LocationFilterContainer
        id="pol-location-filter"
        activeFilter={activeFilters[FILTERS.LOCATION] && activeFilters[FILTERS.LOCATION][0]}
        disabled={disabled}
        labelId="ui-orders.line.accordion.location"
        name={FILTERS.LOCATION}
        onChange={onChange}
      />
      <FundFilter
        activeFilters={activeFilters[FILTERS.FUND_CODE]}
        disabled={disabled}
        id={FILTERS.FUND_CODE}
        labelId="ui-orders.filter.fundCode"
        name={FILTERS.FUND_CODE}
        onChange={onChange}
      />
      <AcqCheckboxFilter
        activeFilters={activeFilters[FILTERS.ORDER_FORMAT]}
        disabled={disabled}
        id={FILTERS.ORDER_FORMAT}
        labelId="ui-orders.poLine.orderFormat"
        name={FILTERS.ORDER_FORMAT}
        onChange={onChange}
        options={ORDER_FORMAT_FILTER_OPTIONS}
      />
      <MaterialTypeFilter
        activeFilters={activeFilters[FILTERS.MATERIAL_TYPE_ELECTRONIC]}
        disabled={disabled}
        id={FILTERS.MATERIAL_TYPE_ELECTRONIC}
        isElectronic
        name={FILTERS.MATERIAL_TYPE_ELECTRONIC}
        onChange={onChange}
        materialTypes={materialTypes}
      />
      <MaterialTypeFilter
        activeFilters={activeFilters[FILTERS.MATERIAL_TYPE_PHYSICAL]}
        disabled={disabled}
        id={FILTERS.MATERIAL_TYPE_PHYSICAL}
        name={FILTERS.MATERIAL_TYPE_PHYSICAL}
        onChange={onChange}
        materialTypes={materialTypes}
      />
      <AcqDateRangeFilter
        activeFilters={activeFilters[FILTERS.DATE_CREATED]}
        disabled={disabled}
        id={FILTERS.DATE_CREATED}
        labelId="ui-orders.poLine.dateCreated"
        name={FILTERS.DATE_CREATED}
        onChange={onChange}
      />
      <PluggableOrganizationFilter
        id={FILTERS.VENDOR}
        activeFilters={activeFilters[FILTERS.VENDOR]}
        disabled={disabled}
        labelId="ui-orders.line.accordion.vendor"
        name={FILTERS.VENDOR}
        onChange={onChange}
      />
      <AcqTagsFilter
        activeFilters={activeFilters[FILTERS.TAGS]}
        disabled={disabled}
        id={FILTERS.TAGS}
        name={FILTERS.TAGS}
        onChange={onChange}
      />
      <SourceFilter
        activeFilters={activeFilters[FILTERS.SOURCE_CODE]}
        disabled={disabled}
        id={FILTERS.SOURCE_CODE}
        name={FILTERS.SOURCE_CODE}
        onChange={onChange}
      />
      <BooleanFilter
        activeFilters={activeFilters[FILTERS.COLLECTION]}
        disabled={disabled}
        id={FILTERS.COLLECTION}
        labelId="ui-orders.filter.collection"
        name={FILTERS.COLLECTION}
        onChange={onChange}
      />
      <BooleanFilter
        activeFilters={activeFilters[FILTERS.RUSH]}
        disabled={disabled}
        id={FILTERS.RUSH}
        labelId="ui-orders.filter.rush"
        name={FILTERS.RUSH}
        onChange={onChange}
      />
      <PluggableOrganizationFilter
        id={FILTERS.ACCESS_PROVIDER}
        activeFilters={activeFilters[FILTERS.ACCESS_PROVIDER]}
        disabled={disabled}
        labelId="ui-orders.eresource.accessProvider"
        name={FILTERS.ACCESS_PROVIDER}
        onChange={onChange}
      />
      <BooleanFilter
        activeFilters={activeFilters[FILTERS.ACTIVATED]}
        disabled={disabled}
        id={FILTERS.ACTIVATED}
        labelId="ui-orders.filter.activated"
        name={FILTERS.ACTIVATED}
        onChange={onChange}
      />
      <AcqDateRangeFilter
        activeFilters={activeFilters[FILTERS.EXPECTED_ACTIVATION_DATE]}
        disabled={disabled}
        id={FILTERS.EXPECTED_ACTIVATION_DATE}
        labelId="ui-orders.eresource.expectedActivation"
        name={FILTERS.EXPECTED_ACTIVATION_DATE}
        onChange={onChange}
      />
      <BooleanFilter
        activeFilters={activeFilters[FILTERS.TRIAL]}
        disabled={disabled}
        id={FILTERS.TRIAL}
        labelId="ui-orders.filter.trial"
        name={FILTERS.TRIAL}
        onChange={onChange}
      />
      <AcqDateRangeFilter
        activeFilters={activeFilters[FILTERS.SUBSCRIPTION_FROM]}
        disabled={disabled}
        id={FILTERS.SUBSCRIPTION_FROM}
        labelId="ui-orders.itemDetails.subscriptionFrom"
        name={FILTERS.SUBSCRIPTION_FROM}
        onChange={onChange}
      />
      <AcqDateRangeFilter
        activeFilters={activeFilters[FILTERS.SUBSCRIPTION_TO]}
        disabled={disabled}
        id={FILTERS.SUBSCRIPTION_TO}
        labelId="ui-orders.itemDetails.subscriptionTo"
        name={FILTERS.SUBSCRIPTION_TO}
        onChange={onChange}
      />
      <AcqDateRangeFilter
        activeFilters={activeFilters[FILTERS.ACTUAL_RECEIPT_DATE]}
        disabled={disabled}
        id={FILTERS.ACTUAL_RECEIPT_DATE}
        labelId="ui-orders.filter.actualReceiptDate"
        name={FILTERS.ACTUAL_RECEIPT_DATE}
        onChange={onChange}
      />
      <AcqDateRangeFilter
        activeFilters={activeFilters[FILTERS.EXPECTED_RECEIPT_DATE]}
        disabled={disabled}
        id={FILTERS.EXPECTED_RECEIPT_DATE}
        labelId="ui-orders.physical.expectedReceiptDate"
        name={FILTERS.EXPECTED_RECEIPT_DATE}
        onChange={onChange}
      />
      <AcqDateRangeFilter
        activeFilters={activeFilters[FILTERS.RECEIPT_DUE]}
        disabled={disabled}
        id={FILTERS.RECEIPT_DUE}
        labelId="ui-orders.physical.receiptDue"
        name={FILTERS.RECEIPT_DUE}
        onChange={onChange}
      />
      {/* <BooleanFilter
        activeFilters={activeFilters[FILTERS.CLAIM]}
        disabled={disabled}
        id={FILTERS.CLAIM}
        labelId="ui-orders.filter.claim"
        name={FILTERS.CLAIM}
        onChange={onChange}
      />
      <OrdersTextFilter
        id={FILTERS.CLAIM_GRACE}
        activeFilters={activeFilters[FILTERS.CLAIM_GRACE]}
        disabled={disabled}
        labelId="ui-orders.filter.claimGrace"
        name={FILTERS.CLAIM_GRACE}
        type="number"
        onChange={onChange}
      />
      <AcqDateRangeFilter
        activeFilters={activeFilters[FILTERS.CLAIM_SENT]}
        disabled={disabled}
        id={FILTERS.CLAIM_SENT}
        labelId="ui-orders.filter.claimSent"
        name={FILTERS.CLAIM_SENT}
        onChange={onChange}
      /> */}
    </AccordionSet>
  );
}

OrderLinesFilters.propTypes = {
  applyFilters: PropTypes.func.isRequired,
  activeFilters: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  materialTypes: materialTypesShape,
};

export default OrderLinesFilters;
