import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  FieldSelectFinal,
  fieldSelectOptionsShape,
  TextField,
} from '@folio/stripes-acq-components';

const FieldVendorAccountNumber = ({ accounts, disabled }) => {
  return (
    accounts.length
      ? (
        <FieldSelectFinal
          dataOptions={accounts}
          fullWidth
          label={<FormattedMessage id="ui-orders.vendor.accountNumber" />}
          name="vendorDetail.vendorAccount"
          isNonInteractive={disabled}
        />
      )
      : (
        <Field
          component={TextField}
          fullWidth
          isNonInteractive={disabled}
          label={<FormattedMessage id="ui-orders.vendor.accountNumber" />}
          name="vendorDetail.vendorAccount"
        />
      )
  );
};

FieldVendorAccountNumber.propTypes = {
  accounts: fieldSelectOptionsShape,
  disabled: PropTypes.bool,
};

FieldVendorAccountNumber.defaultProps = {
  accounts: [],
};

export default FieldVendorAccountNumber;
