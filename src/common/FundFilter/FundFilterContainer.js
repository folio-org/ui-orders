import React from 'react';
import { stripesConnect } from '@folio/stripes/core';

import FundFilter from './FundFilter';
import { getFundOptions } from '../utils';
import { fundShape } from '../shapes';

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
  funds: fundShape,
};

export default stripesConnect(FundFilterContainer);
