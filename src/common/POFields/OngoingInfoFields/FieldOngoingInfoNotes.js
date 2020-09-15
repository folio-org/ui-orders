import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextArea } from '@folio/stripes/components';

import OngoingInfoNotes from './OngoingInfoNotes';

const FieldOngoingInfoNotes = ({ disabled, isNonInteractive }) => {
  return isNonInteractive
    ? <OngoingInfoNotes value={isNonInteractive} />
    : (
      <Field
        component={TextArea}
        fullWidth
        label={<FormattedMessage id="ui-orders.renewals.notes" />}
        name="ongoing.notes"
        disabled={disabled}
        validateFields={[]}
      />
    );
};

FieldOngoingInfoNotes.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.node,
};

FieldOngoingInfoNotes.defaultProps = {
  disabled: false,
};

export default FieldOngoingInfoNotes;
