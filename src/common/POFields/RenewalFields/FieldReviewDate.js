import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldDatepicker,
} from '@folio/stripes-acq-components';

const FieldReviewDate = ({ disabled }) => {
  return (
    <FieldDatepicker
      label={<FormattedMessage id="ui-orders.renewals.reviewDate" />}
      name="renewal.reviewDate"
      disabled={disabled}
    />
  );
};

FieldReviewDate.propTypes = {
  disabled: PropTypes.bool,
};

FieldReviewDate.defaultProps = {
  disabled: false,
};

export default FieldReviewDate;
