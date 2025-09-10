import { FormattedMessage } from 'react-intl';

import { FieldDatepickerFinal } from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../constants';

const FieldExpectedReceiptDate = () => {
  return (
    <FieldDatepickerFinal
      label={<FormattedMessage id="ui-orders.physical.expectedReceiptDate" />}
      name={POL_FORM_FIELDS.physicalExpectedReceiptDate}
    />
  );
};

export default FieldExpectedReceiptDate;
