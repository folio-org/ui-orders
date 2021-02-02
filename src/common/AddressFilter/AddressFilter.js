import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { SelectionFilter } from '@folio/stripes-acq-components';
import { getAddressOptions } from '../utils';

const AddressFilter = ({ addresses, ...rest }) => {
  const options = useMemo(() => getAddressOptions(addresses), [addresses]);

  return (
    <SelectionFilter
      {...rest}
      options={options}
    />
  );
};

AddressFilter.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.object),
};

AddressFilter.defaultProps = {
  addresses: [],
};

export default AddressFilter;
