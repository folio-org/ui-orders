import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldDatepickerFinal,
} from '@folio/stripes-acq-components';

const FieldReviewDate = ({ disabled }) => {
  return (
    <FieldDatepickerFinal
      label={<FormattedMessage id="ui-orders.renewals.reviewDate" />}
      name="ongoing.reviewDate"
      disabled={disabled}
      validateFields={[]}
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
