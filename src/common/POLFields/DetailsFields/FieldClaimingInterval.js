import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';
import {
  validateRequired,
  validateRequiredPositiveNumber,
} from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../constants';

const validate = (value, { claimingActive }) => {
  if (!claimingActive) return undefined;

  return validateRequired(value) || validateRequiredPositiveNumber(value);
};

export const FieldClaimingInterval = ({
  disabled = false,
  required = false,
}) => {
  return (
    <Field
      label={<FormattedMessage id="ui-orders.poLine.claimingInterval" />}
      name={POL_FORM_FIELDS.claimingInterval}
      component={TextField}
      type="number"
      min={1}
      fullWidth
      disabled={disabled}
      required={required}
      validate={validate}
      validateFields={[]}
    />
  );
};

FieldClaimingInterval.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};
