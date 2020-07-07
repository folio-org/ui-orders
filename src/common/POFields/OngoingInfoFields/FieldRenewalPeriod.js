import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

const FieldRenewalPeriod = ({ disabled }) => {
  return (
    <Field
      component={TextField}
      fullWidth
      label={<FormattedMessage id="ui-orders.renewals.reviewPeriod" />}
      name="ongoing.reviewPeriod"
      type="number"
      disabled={disabled}
      validateFields={[]}
    />
  );
};

FieldRenewalPeriod.propTypes = {
  disabled: PropTypes.bool,
};

FieldRenewalPeriod.defaultProps = {
  disabled: false,
};

export default FieldRenewalPeriod;
