import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { TextArea } from '@folio/stripes/components';

const FieldPOLineDescription = () => {
  return (
    <Field
      component={TextArea}
      fullWidth
      label={<FormattedMessage id="ui-orders.poLine.poLineDescription" />}
      name="poLineDescription"
    />
  );
};

export default FieldPOLineDescription;
