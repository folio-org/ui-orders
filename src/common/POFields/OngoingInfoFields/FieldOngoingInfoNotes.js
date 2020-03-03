import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { TextArea } from '@folio/stripes/components';

const FieldOngoingInfoNotes = ({ disabled }) => {
  return (
    <Field
      component={TextArea}
      fullWidth
      label={<FormattedMessage id="ui-orders.renewals.notes" />}
      name="ongoing.notes"
      disabled={disabled}
    />
  );
};

FieldOngoingInfoNotes.propTypes = {
  disabled: PropTypes.bool,
};

FieldOngoingInfoNotes.defaultProps = {
  disabled: false,
};

export default FieldOngoingInfoNotes;
