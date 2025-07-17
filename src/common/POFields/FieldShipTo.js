import PropTypes from 'prop-types';

import { FieldSelectionFinal as FieldSelection } from '@folio/stripes-acq-components';

import { PO_FORM_FIELDS } from '../constants';

const FieldShipTo = ({ addresses }) => {
  return (
    <FieldSelection
      dataOptions={addresses}
      labelId="ui-orders.orderDetails.shipTo"
      name={PO_FORM_FIELDS.shipTo}
      validateFields={[]}
    />
  );
};

FieldShipTo.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FieldShipTo;
