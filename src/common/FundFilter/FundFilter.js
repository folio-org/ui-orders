import React from 'react';

import { SelectionFilter } from '@folio/stripes-acq-components';

const FundFilter = ({ funds, ...rest }) => {
  return (
    <SelectionFilter
      {...rest}
      options={funds}
    />
  );
};

export default FundFilter;
