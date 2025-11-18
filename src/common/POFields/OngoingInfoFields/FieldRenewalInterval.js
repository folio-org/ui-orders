import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  TextField,
  validateRequired,
} from '@folio/stripes-acq-components';

const FieldRenewalInterval = ({
  disabled = false,
  isNonInteractive,
  required = false,
  ...rest
}) => {
  const fieldIsRequired = required && !disabled && !isNonInteractive;

  return (
    <Field
      component={TextField}
      fullWidth
      isNonInteractive={isNonInteractive}
      key={fieldIsRequired ? 1 : 0}
      label={<FormattedMessage id="ui-orders.renewals.renewalInterval" />}
      name="ongoing.interval"
      readOnly={disabled}
      tooltipText={disabled && <FormattedMessage id="ui-orders.renewals.manualRenewal.tooltip" />}
      type="number"
      required={fieldIsRequired}
      validate={fieldIsRequired ? validateRequired : undefined}
      validateFields={[]}
      {...rest}
    />
  );
};

FieldRenewalInterval.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
  required: PropTypes.bool,
};

export default FieldRenewalInterval;
