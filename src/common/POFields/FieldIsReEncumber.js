import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

const FieldIsReEncumber = ({ disabled }) => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      label={<FormattedMessage id="ui-orders.orderDetails.reEncumber" />}
      name="reEncumber"
      type="checkbox"
      disabled={disabled}
      vertical
      validateFields={[]}
    />
  );
};

FieldIsReEncumber.propTypes = {
  disabled: PropTypes.bool,
};

FieldIsReEncumber.defaultProps = {
  disabled: false,
};

export default FieldIsReEncumber;
