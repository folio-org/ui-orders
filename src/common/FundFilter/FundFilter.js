import React from 'react';

import { SelectionFilter } from '@folio/stripes-acq-components';

import {
  getFundOptions,
} from '../utils';
import { fundsShape } from '../shapes';

const FundFilter = ({ funds, ...rest }) => {
  const options = getFundOptions(funds);

  return (
    <SelectionFilter
      {...rest}
      options={options}
    />
  );
};

FundFilter.propTypes = {
  funds: fundsShape,
};

export default FundFilter;
