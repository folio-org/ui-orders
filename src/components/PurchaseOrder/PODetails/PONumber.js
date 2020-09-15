import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

function PONumber({ value }) {
  return (
    <KeyValue
      label={<FormattedMessage id="ui-orders.orderDetails.poNumber" />}
      value={value || <NoValue />}
    />
  );
}

PONumber.propTypes = {
  value: PropTypes.string,
};

export default PONumber;
