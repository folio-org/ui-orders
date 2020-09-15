import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

function TotalUnits({ value }) {
  return (
    <KeyValue
      label={<FormattedMessage id="ui-orders.orderSummary.totalUnits" />}
      value={value ?? <NoValue />}
    />
  );
}

TotalUnits.propTypes = {
  value: PropTypes.number,
};

export default TotalUnits;
