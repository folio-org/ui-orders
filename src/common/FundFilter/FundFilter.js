import React from 'react';

import OrdersSelectionFilter from '../OrdersSelectionFilter';
import {
  getFundOptions,
} from '../utils';
import { fundsShape } from '../shapes';

const FundFilter = ({ funds, ...rest }) => {
  const options = getFundOptions(funds);

  return (
    <OrdersSelectionFilter
      {...rest}
      options={options}
    />
  );
};

FundFilter.propTypes = {
  funds: fundsShape,
};

export default FundFilter;
