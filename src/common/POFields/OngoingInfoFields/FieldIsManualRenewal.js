import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

const FieldIsManualRenewal = ({ disabled }) => {
  return (
    <Field
      component={Checkbox}
      label={<FormattedMessage id="ui-orders.renewals.manualRenewal" />}
      name="ongoing.manualRenewal"
      type="checkbox"
      disabled={disabled}
      vertical
    />
  );
};

FieldIsManualRenewal.propTypes = {
  disabled: PropTypes.bool,
};

FieldIsManualRenewal.defaultProps = {
  disabled: false,
};

export default FieldIsManualRenewal;
