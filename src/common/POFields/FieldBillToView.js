import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

const FieldBillToView = ({ value }) => {
  return (
    <KeyValue
      label={<FormattedMessage id="ui-orders.orderDetails.billTo" />}
      value={value || <NoValue />}
    />
  );
};

FieldBillToView.propTypes = {
  value: PropTypes.string,
};

export default FieldBillToView;
