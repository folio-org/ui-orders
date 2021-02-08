import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  DICT_FUNDS,
  fundsManifest,
} from '@folio/stripes-acq-components';
import OrderLinesFilters from '@folio/plugin-find-po-line/FindPOLine/OrderLinesFilters';

import {
  MATERIAL_TYPES,
} from '../components/Utils/resources';

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);

const OrderLinesFiltersContainer = ({ resources, activeFilters, applyFilters, disabled }) => {
  const funds = get(resources, `${DICT_FUNDS}.records`);
  const materialTypes = get(resources, 'materialTypes.records', []);
  const onChange = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  return (
    <OrderLinesFilters
      funds={funds}
      materialTypes={materialTypes}
      activeFilters={activeFilters}
      onChange={onChange}
      disabled={disabled}
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
  disabled: PropTypes.bool.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(OrderLinesFiltersContainer);
