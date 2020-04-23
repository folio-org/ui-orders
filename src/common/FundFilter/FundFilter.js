import React from 'react';
import PropTypes from 'prop-types';

import { SelectionFilter } from '@folio/stripes-acq-components';

const FundFilter = ({ funds, ...rest }) => {
  return (
    <SelectionFilter
      {...rest}
      options={funds}
    />
  );
};

FundFilter.propTypes = {
  funds: PropTypes.arrayOf(PropTypes.object),
};

export default FundFilter;
