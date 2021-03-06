import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { TextField } from '@folio/stripes-acq-components';

const FieldSelector = ({ disabled }) => {
  return (
    <Field
      component={TextField}
      fullWidth
      id="selector"
      label={<FormattedMessage id="ui-orders.poLine.selector" />}
      name="selector"
      type="text"
      isNonInteractive={disabled}
      validateFields={[]}
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
