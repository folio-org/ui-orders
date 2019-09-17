import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FieldDatepicker } from '@folio/stripes-acq-components';

const FieldExpectedReceiptDate = () => {
  return (
    <FieldDatepicker
      label={<FormattedMessage id="ui-orders.physical.expectedReceiptDate" />}
      name="physical.expectedReceiptDate"
    />
  );
};

export default FieldExpectedReceiptDate;
