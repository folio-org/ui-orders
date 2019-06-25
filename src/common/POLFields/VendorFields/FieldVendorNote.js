import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes/components';

const FieldVendorNote = () => {
  return (
    <Field
      component={TextField}
      fullWidth
      label={<FormattedMessage id="ui-orders.vendor.noteFromVendor" />}
      name="vendorDetail.noteFromVendor"
    />
  );
};

export default FieldVendorNote;
