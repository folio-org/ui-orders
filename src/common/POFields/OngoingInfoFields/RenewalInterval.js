import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

const RenewalInterval = ({ value }) => {
  return (
    <KeyValue
      label={<FormattedMessage id="ui-orders.renewals.renewalInterval" />}
      value={value ?? <NoValue />}
    />
  );
};

RenewalInterval.propTypes = {
  value: PropTypes.number,
};

export default RenewalInterval;
