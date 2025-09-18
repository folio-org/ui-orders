import { FormattedMessage } from 'react-intl';

import { FieldDatepickerFinal } from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../constants';

const FieldReceiptDue = () => {
  return (
    <FieldDatepickerFinal
      label={<FormattedMessage id="ui-orders.physical.receiptDue" />}
      name={POL_FORM_FIELDS.physicalReceiptDue}
      validateFields={[]}
    />
  );
};

export default FieldReceiptDue;
