import PropTypes from 'prop-types';
import { useMemo } from 'react';

import { SelectionFilter } from '@folio/stripes-acq-components';

import { getAddressOptions } from '../utils';

const DEFAULT_ADDRESSES = [];

const AddressFilter = ({
  addresses = DEFAULT_ADDRESSES,
  ...rest
}) => {
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

export default AddressFilter;
