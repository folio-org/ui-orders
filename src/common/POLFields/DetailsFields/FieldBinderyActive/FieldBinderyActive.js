import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import { POL_FORM_FIELDS } from '../../../constants';

export const FieldBinderyActive = ({
  disabled = false,
  onChange,
}) => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      label={<FormattedMessage id="ui-orders.poLine.isBinderyActive" />}
      name={POL_FORM_FIELDS.isBinderyActive}
      type="checkbox"
      disabled={disabled}
      onChange={onChange}
      vertical
    />
  );
};

FieldBinderyActive.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};
