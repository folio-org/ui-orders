import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { reasonsForClosureResource } from '../common/resources';
import {
  ACQUISITIONS_UNITS,
} from '../components/Utils/resources';
import OrdersListFilters from './OrdersListFilters';

const OrdersListFiltersContainer = ({ resources, activeFilters, applyFilters }) => {
  const acqUnits = resources?.acqUnits?.records;
  const closingReasons = resources?.closingReasons?.records;

  return (
    <OrdersListFilters
      acqUnits={acqUnits}
      activeFilters={activeFilters}
      applyFilters={applyFilters}
      closingReasons={closingReasons}
    />
  );
};

OrdersListFiltersContainer.manifest = Object.freeze({
  acqUnits: ACQUISITIONS_UNITS,
  closingReasons: reasonsForClosureResource,
});

OrdersListFiltersContainer.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(OrdersListFiltersContainer);
