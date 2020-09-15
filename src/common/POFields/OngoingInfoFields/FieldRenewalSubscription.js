import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Field, useForm, useFormState } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TooltippedControl } from '@folio/stripes-acq-components';
import { Checkbox } from '@folio/stripes/components';

const FieldRenewalSubscription = ({ disabled, isNonInteractive }) => {
  const { batch, change, resetFieldState } = useForm();
  const { values } = useFormState();
  const isSubscription = !!values?.ongoing?.isSubscription;

  const onChange = useCallback(() => {
    if (isSubscription) {
      resetFieldState('ongoing.interval');
      resetFieldState('ongoing.renewalDate');
      batch(() => {
        change('ongoing.isSubscription', !isSubscription);
        change('ongoing.interval', undefined);
        change('ongoing.renewalDate', undefined);
        change('ongoing.reviewPeriod', undefined);
        change('ongoing.manualRenewal', undefined);
      });
    } else {
      batch(() => {
        change('ongoing.isSubscription', !isSubscription);
        change('ongoing.reviewDate', undefined);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubscription]);

  return (
    <Field
      component={TooltippedControl}
      controlComponent={Checkbox}
      disabled={!disabled && isNonInteractive}
      label={<FormattedMessage id="ui-orders.renewals.subscription" />}
      name="ongoing.isSubscription"
      onChange={onChange}
      readOnly={disabled}
      tooltipText={disabled && <FormattedMessage id="ui-orders.renewals.subscription.tooltip" />}
      type="checkbox"
      validateFields={[]}
      vertical
    />
  );
};

FieldRenewalSubscription.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
};

FieldRenewalSubscription.defaultProps = {
  disabled: false,
  isNonInteractive: false,
};

export default FieldRenewalSubscription;
