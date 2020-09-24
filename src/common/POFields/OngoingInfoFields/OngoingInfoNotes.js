import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
} from '@folio/stripes/components';

const OngoingInfoNotes = ({ value }) => {
  return (
    <KeyValue
      label={<FormattedMessage id="ui-orders.renewals.notes" />}
      value={value}
    />
  );
};

OngoingInfoNotes.propTypes = {
  value: PropTypes.string,
};

export default OngoingInfoNotes;
