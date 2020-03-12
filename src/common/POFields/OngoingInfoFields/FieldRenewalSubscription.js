import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

const FieldRenewalSubscription = ({ disabled }) => {
  return (
    <Field
      component={Checkbox}
      label={<FormattedMessage id="ui-orders.renewals.subscription" />}
      name="ongoing.isSubscription"
      type="checkbox"
      disabled={disabled}
      vertical
    />
  );
};

FieldRenewalSubscription.propTypes = {
  disabled: PropTypes.bool,
};

FieldRenewalSubscription.defaultProps = {
  disabled: false,
};

export default FieldRenewalSubscription;
