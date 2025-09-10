import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../constants';

const FieldUserLimit = ({
  disabled = false,
  ...props
}) => {
  return (
    <Field
      component={TextField}
      disabled={disabled}
      label={<FormattedMessage id="ui-orders.eresource.userLimit" />}
      name={POL_FORM_FIELDS.eresourceUserLimit}
      {...props}
    />
  );
};

FieldUserLimit.propTypes = {
  disabled: PropTypes.bool,
};

export default FieldUserLimit;
