import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

import SubscriptionIntervalView from './SubscriptionIntervalView';

function SubscriptionIntervalField({ isNonInteractive, value, ...rest }) {
  return isNonInteractive
    ? <SubscriptionIntervalView value={value} />
    : (
      <Field
        component={TextField}
        fullWidth
        label={<FormattedMessage id="ui-orders.itemDetails.subscriptionInterval" />}
        name="details.subscriptionInterval"
        type="number"
        validateFields={[]}
        {...rest}
      />
    );
}

SubscriptionIntervalField.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.number,
};

export default SubscriptionIntervalField;
