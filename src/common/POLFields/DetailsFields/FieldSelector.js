import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes/components';

const FieldSelector = ({ disabled }) => {
  return (
    <Field
      component={TextField}
      fullWidth
      id="selector"
      label={<FormattedMessage id="ui-orders.poLine.selector" />}
      name="selector"
      type="text"
      disabled={disabled}
    />
  );
};

FieldSelector.propTypes = {
  disabled: PropTypes.bool,
};

FieldSelector.defaultProps = {
  disabled: false,
};

export default FieldSelector;
