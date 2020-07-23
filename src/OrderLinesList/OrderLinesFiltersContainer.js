import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import {
  MATERIAL_TYPES,
} from '../components/Utils/resources';
import OrderLinesFilters from './OrderLinesFilters';

const OrderLinesFiltersContainer = ({ resources, activeFilters, applyFilters, disabled }) => {
  const materialTypes = get(resources, 'materialTypes.records', []);

  return (
    <OrderLinesFilters
      materialTypes={materialTypes}
      activeFilters={activeFilters}
      applyFilters={applyFilters}
      disabled={disabled}
    />
  );
};

OrderLinesFiltersContainer.manifest = Object.freeze({
  materialTypes: MATERIAL_TYPES,
});

OrderLinesFiltersContainer.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(OrderLinesFiltersContainer);
