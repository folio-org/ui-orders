import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  TooltippedControl,
  validateRequired,
} from '@folio/stripes-acq-components';
import { TextField } from '@folio/stripes/components';

import RenewalInterval from './RenewalInterval';

const FieldRenewalInterval = ({ required, disabled, isNonInteractive }) => {
  const fieldIsRequired = required && !disabled && !isNonInteractive;

  return isNonInteractive
    ? <RenewalInterval value={isNonInteractive} />
    : (
      <Field
        component={TooltippedControl}
        controlComponent={TextField}
        fullWidth
        key={fieldIsRequired ? 1 : 0}
        label={<FormattedMessage id="ui-orders.renewals.renewalInterval" />}
        name="ongoing.interval"
        readOnly={disabled}
        tooltipText={disabled && <FormattedMessage id="ui-orders.renewals.manualRenewal.tooltip" />}
        type="number"
        required={fieldIsRequired}
        validate={fieldIsRequired ? validateRequired : undefined}
        validateFields={[]}
      />
    );
};

FieldRenewalInterval.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  isNonInteractive: PropTypes.node,
};

FieldRenewalInterval.defaultProps = {
  disabled: false,
  required: true,
};

export default FieldRenewalInterval;
