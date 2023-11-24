import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

export const FieldClaimingInterval = ({ disabled }) => {
  return (
    <Field
      label={<FormattedMessage id="ui-orders.poLine.claimingInterval" />}
      name="claimingInterval"
      component={TextField}
      type="number"
      fullWidth
      disabled={disabled}
      validateFields={[]}
    />
  );
};

FieldClaimingInterval.propTypes = {
  disabled: PropTypes.bool,
};
