import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { TextField } from '@folio/stripes/components';
import { validateURL } from '@folio/stripes-acq-components';

const FieldURL = ({ disabled, required }) => {
  return (
    <Field
      component={TextField}
      disabled={disabled}
      label={<FormattedMessage id="ui-orders.eresource.url" />}
      name="eresource.resourceUrl"
      required={required}
      type="text"
      validate={validateURL}
    />
  );
};

FieldURL.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

FieldURL.defaultProps = {
  disabled: false,
  required: false,
};

export default FieldURL;
