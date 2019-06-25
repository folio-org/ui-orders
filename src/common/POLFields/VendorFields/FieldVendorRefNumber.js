import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes/components';

import { requiredRefNumberType } from '../../../components/Utils/Validate';

const FieldVendorRefNumber = () => {
  return (
    <Field
      component={TextField}
      fullWidth
      label={<FormattedMessage id="ui-orders.vendor.refNumber" />}
      name="vendorDetail.refNumber"
      validate={[requiredRefNumberType]}
    />
  );
};

export default FieldVendorRefNumber;
