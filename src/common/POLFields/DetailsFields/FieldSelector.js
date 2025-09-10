import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../constants';

const FieldSelector = ({ disabled = false }) => {
  return (
    <Field
      component={TextField}
      fullWidth
      id="selector"
      label={<FormattedMessage id="ui-orders.poLine.selector" />}
      name={POL_FORM_FIELDS.selector}
      type="text"
      isNonInteractive={disabled}
      validateFields={[]}
    />
  );
};

FieldSelector.propTypes = {
  disabled: PropTypes.bool,
};

export default FieldSelector;
