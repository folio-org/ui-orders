import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { TextField } from '@folio/stripes/components';

import { requiredRefNumberType } from '../../../components/Utils/Validate';

const FieldVendorRefNumber = ({ required }) => {
  return (
    <Field
      component={TextField}
      fullWidth
      label={<FormattedMessage id="ui-orders.vendor.refNumber" />}
      name="vendorDetail.refNumber"
      required={required}
      validate={required ? requiredRefNumberType : undefined}
    />
  );
};

FieldVendorRefNumber.propTypes = {
  required: PropTypes.bool,
};

FieldVendorRefNumber.defaultProps = {
  required: true,
};

export default FieldVendorRefNumber;
