import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { TextField } from '@folio/stripes/components';

const FieldDonor = ({ disabled }) => {
  return (
    <Field
      component={TextField}
      fullWidth
      id="donor"
      label={<FormattedMessage id="ui-orders.poLine.donor" />}
      name="donor"
      type="text"
      disabled={disabled}
    />
  );
};

FieldDonor.propTypes = {
  disabled: PropTypes.bool,
};

FieldDonor.defaultProps = {
  disabled: false,
};

export default FieldDonor;
