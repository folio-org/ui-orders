import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldDatepickerFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

const FieldRenewalDate = ({ required, disabled, isNonInteractive, ...rest }) => {
  const fieldIsRequired = required && !disabled && !isNonInteractive;

  return (
    <FieldDatepickerFinal
      isNonInteractive={isNonInteractive}
      label={<FormattedMessage id="ui-orders.renewals.renewalDate" />}
      name="ongoing.renewalDate"
      readOnly={disabled}
      required={fieldIsRequired}
      validate={fieldIsRequired ? validateRequired : undefined}
      validateFields={[]}
      {...rest}
    />
  );
};

FieldRenewalDate.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
};

FieldRenewalDate.defaultProps = {
  disabled: false,
  required: false,
};

export default FieldRenewalDate;
