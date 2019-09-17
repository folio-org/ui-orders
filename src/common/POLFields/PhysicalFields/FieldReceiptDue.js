import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FieldDatepicker } from '@folio/stripes-acq-components';

const FieldReceiptDue = () => {
  return (
    <FieldDatepicker
      label={<FormattedMessage id="ui-orders.physical.receiptDue" />}
      name="physical.receiptDue"
    />
  );
};

export default FieldReceiptDue;
