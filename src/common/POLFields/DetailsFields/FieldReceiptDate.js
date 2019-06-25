import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes/components';

const FieldReceiptDate = () => {
  return (
    <Field
      component={TextField}
      fullWidth
      label={<FormattedMessage id="ui-orders.poLine.receiptDate" />}
      name="receiptDate"
      type="date"
    />
  );
};

export default FieldReceiptDate;
