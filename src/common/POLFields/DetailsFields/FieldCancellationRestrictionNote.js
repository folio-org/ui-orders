import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { TextArea } from '@folio/stripes/components';

const FieldCancellationRestrictionNote = () => {
  return (
    <Field
      component={TextArea}
      fullWidth
      label={<FormattedMessage id="ui-orders.poLine.cancellationRestrictionNote" />}
      name="cancellationRestrictionNote"
    />
  );
};

export default FieldCancellationRestrictionNote;
