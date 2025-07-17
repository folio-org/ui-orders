import PropTypes from 'prop-types';

import { FieldSelectionFinal as FieldSelection } from '@folio/stripes-acq-components';

import { PO_FORM_FIELDS } from '../constants';

const FieldBillTo = ({
  addresses,
  isNonInteractive = false,
  ...rest
}) => {
  return (
    <FieldSelection
      dataOptions={addresses}
      isNonInteractive={isNonInteractive}
      labelId="ui-orders.orderDetails.billTo"
      name={PO_FORM_FIELDS.billTo}
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
