import React from 'react';
import { stripesConnect } from '@folio/stripes/core';
import PropTypes from 'prop-types';

import FundFilter from './FundFilter';
import { getFundOptions } from '../utils';

const FundFilterContainer = ({ funds, ...rest }) => {
  const options = getFundOptions(funds);

  return (
    <FundFilter
      {...rest}
      funds={options}
    />
  );
};

FundFilterContainer.propTypes = {
  funds: PropTypes.arrayOf(PropTypes.object),
};

export default stripesConnect(FundFilterContainer);
