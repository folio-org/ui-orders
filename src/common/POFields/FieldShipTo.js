import React from 'react';
import PropTypes from 'prop-types';

import { FieldSelectionFinal as FieldSelection } from '@folio/stripes-acq-components';

const FieldShipTo = ({ addresses }) => {
  return (
    <FieldSelection
      dataOptions={addresses}
      labelId="ui-orders.orderDetails.shipTo"
      name="shipTo"
      validateFields={[]}
    />
  );
};

FieldShipTo.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FieldShipTo;
