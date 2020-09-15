import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

const RenewalPeriod = ({ value }) => {
  return (
    <KeyValue
      label={<FormattedMessage id="ui-orders.renewals.reviewPeriod" />}
      value={value ?? <NoValue />}
    />
  );
};

RenewalPeriod.propTypes = {
  value: PropTypes.number,
};

export default RenewalPeriod;
