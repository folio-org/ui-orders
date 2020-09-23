import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldDatepickerFinal,
} from '@folio/stripes-acq-components';

const FieldReviewDate = ({ disabled, isNonInteractive }) => {
  return (
    <FieldDatepickerFinal
      isNonInteractive={isNonInteractive}
      label={<FormattedMessage id="ui-orders.renewals.reviewDate" />}
      name="ongoing.reviewDate"
      readOnly={disabled}
      validateFields={[]}
    />
  );
};

FieldReviewDate.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
};

FieldReviewDate.defaultProps = {
  disabled: false,
};

export default FieldReviewDate;
