import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Checkbox } from '@folio/stripes/components';

const FieldAutomaticExport = () => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      label={<FormattedMessage id="ui-orders.poLine.automaticExport" />}
      name="automaticExport"
      type="checkbox"
      vertical
      validateFields={[]}
    />
  );
};

export default FieldAutomaticExport;
