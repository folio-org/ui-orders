import React from 'react';
import PropTypes from 'prop-types';

import FieldSelection from '../FieldSelection';

const FieldVendor = ({ vendors, required, validate }) => {
  return (
    <FieldSelection
      dataOptions={vendors}
      labelId="ui-orders.orderDetails.vendor"
      name="vendor"
      required={required}
      validate={validate}
    />
  );
};

FieldVendor.propTypes = {
  vendors: PropTypes.arrayOf(PropTypes.object).isRequired,
  required: PropTypes.bool,
  validate: PropTypes.func,
};

export default FieldVendor;
