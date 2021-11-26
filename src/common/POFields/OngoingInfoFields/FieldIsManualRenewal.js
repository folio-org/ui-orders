import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TooltippedControl } from '@folio/stripes-acq-components';
import { Checkbox } from '@folio/stripes/components';

const FieldIsManualRenewal = ({ disabled, isNonInteractive }) => {
  return (
    <Field
      component={TooltippedControl}
      controlComponent={Checkbox}
      label={<FormattedMessage id="ui-orders.renewals.manualRenewal" />}
      name="ongoing.manualRenewal"
      readOnly={disabled}
      tooltipText={disabled && <FormattedMessage id="ui-orders.renewals.manualRenewal.tooltip" />}
      type="checkbox"
      disabled={!disabled && isNonInteractive}
      vertical
      validateFields={[]}
      fullWidth
    />
  );
};

FieldIsManualRenewal.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
};

FieldIsManualRenewal.defaultProps = {
  disabled: false,
  isNonInteractive: false,
};

export default FieldIsManualRenewal;
