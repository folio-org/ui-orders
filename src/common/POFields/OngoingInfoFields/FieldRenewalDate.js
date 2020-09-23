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
      key={fieldIsRequired ? 1 : 0}
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
  required: true,
};

export default FieldRenewalDate;
