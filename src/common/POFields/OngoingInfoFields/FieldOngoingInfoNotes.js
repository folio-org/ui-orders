import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextArea } from '@folio/stripes-acq-components';

const FieldOngoingInfoNotes = (props) => {
  return (
    <Field
      component={TextArea}
      fullWidth
      label={<FormattedMessage id="ui-orders.renewals.notes" />}
      name="ongoing.notes"
      validateFields={[]}
      {...props}
    />
  );
};

FieldOngoingInfoNotes.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
};

FieldOngoingInfoNotes.defaultProps = {
  disabled: false,
};

export default FieldOngoingInfoNotes;
