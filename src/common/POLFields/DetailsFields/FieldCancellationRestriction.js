import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Checkbox } from '@folio/stripes/components';

const FieldCancellationRestriction = () => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      label={<FormattedMessage id="ui-orders.poLine.cancellationRestriction" />}
      name="cancellationRestriction"
      type="checkbox"
      vertical
      validateFields={[]}
    />
  );
};

export default FieldCancellationRestriction;
