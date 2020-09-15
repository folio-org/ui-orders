import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldDatepickerFinal,
} from '@folio/stripes-acq-components';

import ReviewDate from './ReviewDate';

const FieldReviewDate = ({ disabled, isNonInteractive }) => {
  return isNonInteractive
    ? <ReviewDate value={isNonInteractive} />
    : (
      <FieldDatepickerFinal
        label={<FormattedMessage id="ui-orders.renewals.reviewDate" />}
        name="ongoing.reviewDate"
        readOnly={disabled}
        validateFields={[]}
      />
    );
};

FieldReviewDate.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.node,
};

FieldReviewDate.defaultProps = {
  disabled: false,
};

export default FieldReviewDate;
