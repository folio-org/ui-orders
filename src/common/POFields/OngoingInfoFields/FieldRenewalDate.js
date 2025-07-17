import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldDatepickerFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

import { PO_FORM_FIELDS } from '../../constants';

const FieldRenewalDate = ({
  required = false,
  disabled = false,
  isNonInteractive = false,
  ...rest
}) => {
  const fieldIsRequired = required && !disabled && !isNonInteractive;

  return (
    <FieldDatepickerFinal
      isNonInteractive={isNonInteractive}
      label={<FormattedMessage id="ui-orders.renewals.renewalDate" />}
      name={PO_FORM_FIELDS.renewalDate}
      readOnly={disabled}
      tooltipText={disabled && <FormattedMessage id="ui-orders.renewals.manualRenewal.tooltip" />}
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

export default FieldRenewalDate;
