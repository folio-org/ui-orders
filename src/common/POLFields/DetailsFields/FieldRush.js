import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Checkbox } from '@folio/stripes/components';

const FieldRush = ({ disabled }) => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      id="rush"
      label={<FormattedMessage id="ui-orders.poLine.rush" />}
      name="rush"
      type="checkbox"
      disabled={disabled}
      vertical
      validateFields={[]}
    />
  );
};

FieldRush.propTypes = {
  disabled: PropTypes.bool,
};

FieldRush.defaultProps = {
  disabled: false,
};

export default FieldRush;
