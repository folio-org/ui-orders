import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import { PO_FORM_FIELDS } from '../constants';

const FieldIsReEncumber = ({ disabled = false }) => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      label={<FormattedMessage id="ui-orders.orderDetails.reEncumber" />}
      name={PO_FORM_FIELDS.reEncumber}
      type="checkbox"
      disabled={disabled}
      vertical
      validateFields={[]}
    />
  );
};

FieldIsReEncumber.propTypes = {
  disabled: PropTypes.bool,
};

export default FieldIsReEncumber;
