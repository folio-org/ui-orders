import PropTypes from 'prop-types';
import { useCallback } from 'react';
import {
  Field,
  useForm,
  useFormState,
} from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TooltippedControl } from '@folio/stripes-acq-components';
import { Checkbox } from '@folio/stripes/components';

import { PO_FORM_FIELDS } from '../../constants';

const FieldRenewalSubscription = ({
  disabled = false,
  isNonInteractive = false,
}) => {
  const { batch, change, resetFieldState } = useForm();
  const { values } = useFormState();
  const isSubscription = !!values?.ongoing?.isSubscription;

  const onChange = useCallback(() => {
    if (isSubscription) {
      resetFieldState(PO_FORM_FIELDS.ongoingInterval);
      resetFieldState(PO_FORM_FIELDS.renewalDate);
      batch(() => {
        change(PO_FORM_FIELDS.isSubscription, !isSubscription);
        change(PO_FORM_FIELDS.ongoingInterval, undefined);
        change(PO_FORM_FIELDS.renewalDate, undefined);
        change(PO_FORM_FIELDS.reviewPeriod, undefined);
        change(PO_FORM_FIELDS.manualRenewal, undefined);
      });
    } else {
      batch(() => {
        change(PO_FORM_FIELDS.isSubscription, !isSubscription);
        change(PO_FORM_FIELDS.reviewDate, undefined);
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
      name={PO_FORM_FIELDS.isSubscription}
      onChange={onChange}
      readOnly={disabled}
      tooltipText={disabled && <FormattedMessage id="ui-orders.renewals.subscription.tooltip" />}
      type="checkbox"
      validateFields={[]}
      vertical
      fullWidth
    />
  );
};

FieldRenewalSubscription.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
};

export default FieldRenewalSubscription;
