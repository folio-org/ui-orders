import React from 'react';
import PropTypes from 'prop-types';

import { FieldSelection } from '@folio/stripes-acq-components';

const FieldVendor = ({ vendors, disabled, required, ...rest }) => {
  return (
    <FieldSelection
      dataOptions={vendors}
      disabled={disabled}
      id="po-vendor"
      labelId="ui-orders.orderDetails.vendor"
      name="vendor"
      required={required}
      {...rest}
    />
  );
};

FieldVendor.propTypes = {
  vendors: PropTypes.arrayOf(PropTypes.object).isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

FieldVendor.defaultProps = {
  disabled: false,
  required: true,
};

export default FieldVendor;
