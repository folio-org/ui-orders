import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TooltipCheckbox } from '@folio/stripes-acq-components';

const FieldIsManualRenewal = ({ disabled, isNonInteractive }) => {
  return (
    <Field
      component={TooltipCheckbox}
      label={<FormattedMessage id="ui-orders.renewals.manualRenewal" />}
      name="ongoing.manualRenewal"
      readOnly={disabled}
      tooltipText={disabled && <FormattedMessage id="ui-orders.renewals.manualRenewal.tooltip" />}
      type="checkbox"
      disabled={!disabled && isNonInteractive}
      vertical
      validateFields={[]}
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
