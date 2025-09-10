import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import { POL_FORM_FIELDS } from '../../constants';

const FieldRush = ({ disabled = false }) => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      id="rush"
      label={<FormattedMessage id="ui-orders.poLine.rush" />}
      name={POL_FORM_FIELDS.rush}
      type="checkbox"
      disabled={disabled}
      vertical
      validateFields={[]}
    />
  );
};

FieldRush.propTypes = {
  disabled: PropTypes.bool,
};

export default FieldRush;
