import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { DICT_FUNDS, fundsManifest } from '@folio/stripes-acq-components';

import FundFilter from './FundFilter';
import { getFundOptions } from '../utils';

const FundFilterContainer = ({ resources, ...rest }) => {
  const funds = getFundOptions(resources);

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
