import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes-acq-components';

const FieldRenewalPeriod = ({ disabled, isNonInteractive }) => {
  return (
    <Field
      component={TextField}
      fullWidth
      isNonInteractive={isNonInteractive}
      label={<FormattedMessage id="ui-orders.renewals.reviewPeriod" />}
      name="ongoing.reviewPeriod"
      readOnly={disabled}
      tooltipText={disabled && <FormattedMessage id="ui-orders.renewals.manualRenewal.tooltip" />}
      type="number"
      validateFields={[]}
    />
  );
};

FieldRenewalPeriod.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
};

FieldRenewalPeriod.defaultProps = {
  disabled: false,
};

export default FieldRenewalPeriod;
