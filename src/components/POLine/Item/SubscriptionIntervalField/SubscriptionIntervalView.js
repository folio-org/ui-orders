import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

function SubscriptionIntervalView({ value }) {
  return (
    <KeyValue
      label={<FormattedMessage id="ui-orders.itemDetails.subscriptionInterval" />}
      value={value ?? <NoValue />}
    />
  );
}

SubscriptionIntervalView.propTypes = {
  value: PropTypes.number,
};

export default SubscriptionIntervalView;
