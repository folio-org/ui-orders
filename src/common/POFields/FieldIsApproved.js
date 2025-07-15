import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import { PO_FORM_FIELDS } from '../constants';

const FieldIsApproved = ({ disabled = false }) => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      label={<FormattedMessage id="ui-orders.orderSummary.approved" />}
      name={PO_FORM_FIELDS.approved}
      type="checkbox"
      disabled={disabled}
      vertical
      validateFields={[]}
    />
  );
};

FieldIsApproved.propTypes = {
  disabled: PropTypes.bool,
};

export default FieldIsApproved;
