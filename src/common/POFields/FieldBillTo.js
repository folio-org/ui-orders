import React from 'react';
import PropTypes from 'prop-types';

import { FieldSelection } from '@folio/stripes-acq-components';

const FieldBillTo = ({ addresses, disabled }) => {
  return (
    <FieldSelection
      dataOptions={addresses}
      labelId="ui-orders.orderDetails.billTo"
      name="billTo"
      disabled={disabled}
    />
  );
};

FieldBillTo.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.object).isRequired,
  disabled: PropTypes.bool,
};

FieldBillTo.defaultProps = {
  disabled: false,
};

export default FieldBillTo;
