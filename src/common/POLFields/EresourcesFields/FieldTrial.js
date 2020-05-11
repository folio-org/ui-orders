import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Checkbox } from '@folio/stripes/components';

const FieldTrial = ({ disabled }) => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      label={<FormattedMessage id="ui-orders.eresource.trial" />}
      name="eresource.trial"
      type="checkbox"
      disabled={disabled}
      vertical
    />
  );
};

FieldTrial.propTypes = {
  disabled: PropTypes.bool,
};

FieldTrial.defaultProps = {
  disabled: false,
};

export default FieldTrial;
