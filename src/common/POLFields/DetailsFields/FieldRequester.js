import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { TextField } from '@folio/stripes-acq-components';

const FieldRequester = ({ disabled }) => {
  return (
    <Field
      component={TextField}
      fullWidth
      id="requester"
      label={<FormattedMessage id="ui-orders.poLine.requester" />}
      name="requester"
      type="text"
      isNonInteractive={disabled}
      validateFields={[]}
    />
  );
};

FieldRequester.propTypes = {
  disabled: PropTypes.bool,
};

FieldRequester.defaultProps = {
  disabled: false,
};

export default FieldRequester;
