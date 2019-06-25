import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { Select } from '@folio/stripes/components';

import { addEmptyOption } from '../../../components/PurchaseOrder/util';

const FieldVendorAccountNumber = ({ accounts, disabled }) => {
  return (
    <Field
      component={Select}
      dataOptions={addEmptyOption(accounts)}
      fullWidth
      label={<FormattedMessage id="ui-orders.vendor.accountNumber" />}
      name="vendorDetail.vendorAccount"
      disabled={disabled}
    />
  );
};

FieldVendorAccountNumber.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool,
};

FieldVendorAccountNumber.defaultProps = {
  accounts: [],
};

export default FieldVendorAccountNumber;
