import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { TextField } from '@folio/stripes/components';

const FieldUserLimit = ({ disabled }) => {
  return (
    <Field
      component={TextField}
      label={<FormattedMessage id="ui-orders.eresource.userLimit" />}
      name="eresource.userLimit"
      type="number"
      disabled={disabled}
    />
  );
};

FieldUserLimit.propTypes = {
  disabled: PropTypes.bool,
};

FieldUserLimit.defaultProps = {
  disabled: false,
};

export default FieldUserLimit;
