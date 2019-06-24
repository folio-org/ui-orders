import React from 'react';
import PropTypes from 'prop-types';

import FieldSelection from '../FieldSelection';

const FieldVendor = ({ vendors, name, required, validate }) => {
  return (
    <FieldSelection
      dataOptions={vendors}
      labelId="ui-orders.orderDetails.vendor"
      name={name}
      required={required}
      validate={validate}
    />
  );
};

FieldVendor.propTypes = {
  vendors: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string,
  required: PropTypes.bool,
  validate: PropTypes.func,
};

FieldVendor.defaultProps = {
  name: 'vendorName',
};

export default FieldVendor;
