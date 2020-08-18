import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { TextField } from '@folio/stripes/components';
import { validateURL } from '@folio/stripes-acq-components';

const FieldURL = props => (
  <Field
    component={TextField}
    label={<FormattedMessage id="ui-orders.eresource.url" />}
    name="eresource.resourceUrl"
    type="text"
    validate={validateURL}
    {...props}
  />
);

export default FieldURL;
