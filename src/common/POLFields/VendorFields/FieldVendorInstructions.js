import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { TextArea } from '@folio/stripes-acq-components';

const styles = {
  height: '82px',
};

const FieldVendorInstructions = ({ disabled }) => {
  return (
    <Field
      component={TextArea}
      fullWidth
      label={<FormattedMessage id="ui-orders.vendor.instructions" />}
      name="vendorDetail.instructions"
      style={styles}
      isNonInteractive={disabled}
    />
  );
};

FieldVendorInstructions.propTypes = {
  disabled: PropTypes.bool,
};

export default FieldVendorInstructions;
