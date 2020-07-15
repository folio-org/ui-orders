import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FieldDatepickerFinal } from '@folio/stripes-acq-components';

const FieldReceiptDue = () => {
  return (
    <FieldDatepickerFinal
      label={<FormattedMessage id="ui-orders.physical.receiptDue" />}
      name="physical.receiptDue"
      validateFields={[]}
    />
  );
};

export default FieldReceiptDue;
