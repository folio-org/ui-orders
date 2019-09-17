import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FieldDatepicker } from '@folio/stripes-acq-components';

const FieldReceiptDate = () => {
  return (
    <FieldDatepicker
      label={<FormattedMessage id="ui-orders.poLine.receiptDate" />}
      name="receiptDate"
    />
  );
};

export default FieldReceiptDate;
