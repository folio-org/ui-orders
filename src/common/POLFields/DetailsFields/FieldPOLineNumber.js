import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes/components';

const FieldPOLineNumber = () => {
  return (
    <Field
      component={TextField}
      disabled
      fullWidth
      label={<FormattedMessage id="ui-orders.poLine.number" />}
      name="poLineNumber"
      type="text"
    />
  );
};

export default FieldPOLineNumber;
