import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FieldDatepickerFinal } from '@folio/stripes-acq-components';

import { PO_FORM_FIELDS } from '../../constants';

const FieldReviewDate = ({
  disabled = false,
  isNonInteractive = false,
}) => {
  return (
    <FieldDatepickerFinal
      isNonInteractive={isNonInteractive}
      label={<FormattedMessage id="ui-orders.renewals.reviewDate" />}
      name={PO_FORM_FIELDS.reviewDate}
      readOnly={disabled}
      validateFields={[]}
    />
  );
};

FieldReviewDate.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
};

export default FieldReviewDate;
