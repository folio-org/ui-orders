import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldDatepicker,
  validateRequired,
} from '@folio/stripes-acq-components';

const FieldRenewalDate = ({ required, disabled }) => {
  return (
    <FieldDatepicker
      label={<FormattedMessage id="ui-orders.renewals.renewalDate" />}
      name="renewal.renewalDate"
      required={required}
      validate={required && validateRequired}
      disabled={disabled}
    />
  );
};

FieldRenewalDate.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

FieldRenewalDate.defaultProps = {
  disabled: false,
  required: true,
};

export default FieldRenewalDate;
