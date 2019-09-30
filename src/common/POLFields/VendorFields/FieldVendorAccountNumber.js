import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldSelect,
  fieldSelectOptionsShape,
} from '@folio/stripes-acq-components';

const FieldVendorAccountNumber = ({ accounts, disabled }) => {
  return (
    <FieldSelect
      dataOptions={accounts}
      fullWidth
      label={<FormattedMessage id="ui-orders.vendor.accountNumber" />}
      name="vendorDetail.vendorAccount"
      disabled={disabled}
    />
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
