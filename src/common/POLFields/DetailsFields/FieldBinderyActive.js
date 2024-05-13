import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

export const FieldBinderyActive = ({ disabled = false }) => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      label={<FormattedMessage id="ui-orders.poLine.isBindaryActive" />}
      name="details.isBindaryActive"
      type="checkbox"
      disabled={disabled}
      vertical
    />
  );
};

FieldBinderyActive.propTypes = {
  disabled: PropTypes.bool,
};
