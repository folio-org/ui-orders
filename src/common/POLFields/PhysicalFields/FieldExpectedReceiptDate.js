import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FieldDatepickerFinal } from '@folio/stripes-acq-components';

const FieldExpectedReceiptDate = () => {
  return (
    <FieldDatepickerFinal
      label={<FormattedMessage id="ui-orders.physical.expectedReceiptDate" />}
      name="physical.expectedReceiptDate"
    />
  );
};

export default FieldExpectedReceiptDate;
