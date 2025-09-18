import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../constants';

const FieldRequester = ({ disabled = false }) => {
  return (
    <Field
      component={TextField}
      fullWidth
      id="requester"
      label={<FormattedMessage id="ui-orders.poLine.requester" />}
      name={POL_FORM_FIELDS.requester}
      type="text"
      isNonInteractive={disabled}
      validateFields={[]}
    />
  );
};

FieldRequester.propTypes = {
  disabled: PropTypes.bool,
};

export default FieldRequester;
