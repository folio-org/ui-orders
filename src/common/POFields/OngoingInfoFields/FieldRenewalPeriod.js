import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TooltipTextField } from '@folio/stripes-acq-components';

import RenewalPeriod from './RenewalPeriod';

const FieldRenewalPeriod = ({ disabled, isNonInteractive }) => {
  return isNonInteractive
    ? <RenewalPeriod value={isNonInteractive} />
    : (
      <Field
        component={TooltipTextField}
        fullWidth
        label={<FormattedMessage id="ui-orders.renewals.reviewPeriod" />}
        name="ongoing.reviewPeriod"
        readOnly={disabled}
        tooltipText={disabled && <FormattedMessage id="ui-orders.renewals.manualRenewal.tooltip" />}
        type="number"
        validateFields={[]}
      />
    );
};

FieldRenewalPeriod.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.node,
};

FieldRenewalPeriod.defaultProps = {
  disabled: false,
};

export default FieldRenewalPeriod;
