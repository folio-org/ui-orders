import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes-acq-components';

import { PO_FORM_FIELDS } from '../../constants';

const FieldRenewalPeriod = ({
  disabled = false,
  isNonInteractive = false,
}) => {
  return (
    <Field
      component={TextField}
      fullWidth
      isNonInteractive={isNonInteractive}
      label={<FormattedMessage id="ui-orders.renewals.reviewPeriod" />}
      name={PO_FORM_FIELDS.reviewPeriod}
      readOnly={disabled}
      tooltipText={disabled && <FormattedMessage id="ui-orders.renewals.manualRenewal.tooltip" />}
      type="number"
      validateFields={[]}
    />
  );
};

FieldRenewalPeriod.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
};

export default FieldRenewalPeriod;
