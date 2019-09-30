import React from 'react';
import PropTypes from 'prop-types';

import { FieldSelection } from '@folio/stripes-acq-components';

const FieldAccessProvider = ({ vendors, disabled, required }) => {
  return (
    <FieldSelection
      dataOptions={vendors}
      labelId="ui-orders.eresource.accessProvider"
      name="eresource.accessProvider"
      required={required}
      disabled={disabled}
    />
  );
};

FieldAccessProvider.propTypes = {
  vendors: PropTypes.arrayOf(PropTypes.object).isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

FieldAccessProvider.defaultProps = {
  disabled: false,
  required: true,
};

export default FieldAccessProvider;
