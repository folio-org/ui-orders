import React from 'react';

import OrdersSelectionFilter from '../OrdersSelectionFilter';

const SourceFilter = (props) => {
  const options = [{ value: 'FOLIO', label: 'FOLIO' }];

  return (
    <OrdersSelectionFilter
      {...props}
      options={options}
    />
  );
};

export default SourceFilter;
