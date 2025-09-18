import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import { POL_FORM_FIELDS } from '../../constants';

const FieldTrial = ({ disabled = false }) => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      label={<FormattedMessage id="ui-orders.eresource.trial" />}
      name={POL_FORM_FIELDS.eresourceTrial}
      type="checkbox"
      disabled={disabled}
      vertical
    />
  );
};

FieldTrial.propTypes = {
  disabled: PropTypes.bool,
};

export default FieldTrial;
