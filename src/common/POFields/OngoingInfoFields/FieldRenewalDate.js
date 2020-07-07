import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldDatepickerFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

const FieldRenewalDate = ({ required, disabled }) => {
  return (
    <FieldDatepickerFinal
      label={<FormattedMessage id="ui-orders.renewals.renewalDate" />}
      name="ongoing.renewalDate"
      required={required}
      validate={required ? validateRequired : undefined}
      disabled={disabled}
      validateFields={[]}
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
