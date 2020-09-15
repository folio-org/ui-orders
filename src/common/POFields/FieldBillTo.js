import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FieldSelectionFinal as FieldSelection } from '@folio/stripes-acq-components';
import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

const FieldBillTo = ({ addresses, disabled, isNonInteractive }) => {
  return isNonInteractive
    ? (
      <KeyValue
        label={<FormattedMessage id="ui-orders.orderDetails.billTo" />}
        value={isNonInteractive || <NoValue />}
      />
    )
    : (
      <FieldSelection
        dataOptions={addresses}
        labelId="ui-orders.orderDetails.billTo"
        name="billTo"
        disabled={disabled}
        validateFields={[]}
      />
    );
};

FieldBillTo.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.object).isRequired,
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.node,
};

FieldBillTo.defaultProps = {
  disabled: false,
};

export default FieldBillTo;
