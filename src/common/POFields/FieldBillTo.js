import React from 'react';
import PropTypes from 'prop-types';

import { FieldSelectionFinal as FieldSelection } from '@folio/stripes-acq-components';

const FieldBillTo = ({ addresses, ...rest }) => {
  return (
    <FieldSelection
      dataOptions={addresses}
      labelId="ui-orders.orderDetails.billTo"
      name="billTo"
      validateFields={[]}
      {...rest}
    />
  );
};

FieldBillTo.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.object).isRequired,
  isNonInteractive: PropTypes.bool,
};

export default FieldBillTo;
