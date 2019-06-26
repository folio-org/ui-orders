import React from 'react';
import PropTypes from 'prop-types';

import FieldSelection from '../FieldSelection';
import { Required } from '../../components/Utils/Validate';

const FieldVendor = ({ vendors }) => {
  return (
    <FieldSelection
      dataOptions={vendors}
      labelId="ui-orders.orderDetails.vendor"
      name="vendor"
      required
      validate={[Required]}
    />
  );
};

FieldVendor.propTypes = {
  vendors: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FieldVendor;
