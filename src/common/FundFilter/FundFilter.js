import React from 'react';
import PropTypes from 'prop-types';

import { SelectionFilter } from '@folio/stripes-acq-components';
import { fundShape } from '../shapes';

const FundFilter = ({ funds, ...rest }) => {
  return (
    <SelectionFilter
      {...rest}
      options={funds}
    />
  );
};

FundFilter.propTypes = {
  funds: PropTypes.arrayOf(fundShape),
};

export default FundFilter;
