import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FieldDatepickerFinal } from '@folio/stripes-acq-components';

const FieldReceiptDate = () => {
  return (
    <FieldDatepickerFinal
      label={<FormattedMessage id="ui-orders.poLine.receiptDate" />}
      name="receiptDate"
    />
  );
};

export default FieldReceiptDate;
