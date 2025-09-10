import { FormattedMessage } from 'react-intl';

import { FieldDatepickerFinal } from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../constants';

const FieldReceiptDate = () => {
  return (
    <FieldDatepickerFinal
      label={<FormattedMessage id="ui-orders.poLine.receiptDate" />}
      name={POL_FORM_FIELDS.receiptDate}
      validateFields={[]}
    />
  );
};

export default FieldReceiptDate;
