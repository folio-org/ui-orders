import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { TextArea } from '@folio/stripes/components';

const FieldRenewalNotes = ({ disabled }) => {
  return (
    <Field
      component={TextArea}
      fullWidth
      label={<FormattedMessage id="ui-orders.renewals.notes" />}
      name="renewal.notes"
      disabled={disabled}
    />
  );
};

FieldRenewalNotes.propTypes = {
  disabled: PropTypes.bool,
};

FieldRenewalNotes.defaultProps = {
  disabled: false,
};

export default FieldRenewalNotes;
