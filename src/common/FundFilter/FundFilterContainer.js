import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  DICT_FUNDS,
  fundsManifest,
} from '@folio/stripes-acq-components';

import FundFilter from './FundFilter';

const FundFilterContainer = ({ resources, ...rest }) => {
  const funds = resources[DICT_FUNDS]?.records;

  if (!funds) {
    return null;
  }

  return (
    <FundFilter
      {...rest}
      funds={funds}
    />
  );
};

FundFilterContainer.manifest = Object.freeze({
  [DICT_FUNDS]: fundsManifest,
});

FundFilterContainer.propTypes = {
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(FundFilterContainer);
