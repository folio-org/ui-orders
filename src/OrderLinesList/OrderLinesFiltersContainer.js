import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  DICT_FUNDS,
  fundsManifest,
} from '@folio/stripes-acq-components';

import {
  MATERIAL_TYPES,
} from '../components/Utils/resources';
import OrderLinesFilters from './OrderLinesFilters';

const OrderLinesFiltersContainer = ({ resources, activeFilters, applyFilters }) => {
  const materialTypes = get(resources, 'materialTypes.records', []);
  const funds = get(resources, `${DICT_FUNDS}.records`, []);

  return (
    <OrderLinesFilters
      funds={funds}
      materialTypes={materialTypes}
      activeFilters={activeFilters}
      applyFilters={applyFilters}
    />
  );
};

OrderLinesFiltersContainer.manifest = Object.freeze({
  [DICT_FUNDS]: fundsManifest,
  materialTypes: MATERIAL_TYPES,
});

OrderLinesFiltersContainer.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(OrderLinesFiltersContainer);
