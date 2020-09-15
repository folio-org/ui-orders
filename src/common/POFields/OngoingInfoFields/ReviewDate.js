import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FolioFormattedDate } from '@folio/stripes-acq-components';
import { KeyValue } from '@folio/stripes/components';

const ReviewDate = ({ value }) => {
  return (
    <KeyValue
      label={<FormattedMessage id="ui-orders.renewals.reviewDate" />}
      value={<FolioFormattedDate value={value} />}
    />
  );
};

ReviewDate.propTypes = {
  value: PropTypes.string,
};

export default ReviewDate;
