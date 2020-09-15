import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FolioFormattedDate } from '@folio/stripes-acq-components';
import { KeyValue } from '@folio/stripes/components';

const RenewalDate = ({ value }) => {
  return (
    <KeyValue label={<FormattedMessage id="ui-orders.renewals.renewalDate" />}>
      <FolioFormattedDate value={value} />
    </KeyValue>
  );
};

RenewalDate.propTypes = {
  value: PropTypes.string,
};

export default RenewalDate;
