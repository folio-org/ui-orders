import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldDatepickerFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

import RenewalDate from './RenewalDate';

const FieldRenewalDate = ({ required, disabled, isNonInteractive }) => {
  const fieldIsRequired = required && !disabled && !isNonInteractive;

  return isNonInteractive
    ? <RenewalDate value={isNonInteractive} />
    : (
      <FieldDatepickerFinal
        key={fieldIsRequired ? 1 : 0}
        label={<FormattedMessage id="ui-orders.renewals.renewalDate" />}
        name="ongoing.renewalDate"
        readOnly={disabled}
        required={fieldIsRequired}
        validate={fieldIsRequired ? validateRequired : undefined}
        validateFields={[]}
      />
    );
};

FieldRenewalDate.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  isNonInteractive: PropTypes.node,
};

FieldRenewalDate.defaultProps = {
  disabled: false,
  required: true,
};

export default FieldRenewalDate;
