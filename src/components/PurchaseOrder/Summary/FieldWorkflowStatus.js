import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  FieldSelectFinal as FieldSelect,
  ORDER_STATUSES,
} from '@folio/stripes-acq-components';

const WORKFLOW_STATUS_OPTIONS = Object.keys(ORDER_STATUSES).map((key) => ({
  labelId: `ui-orders.workflowStatus.${key}`,
  value: ORDER_STATUSES[key],
}));

function FieldWorkflowStatus({ isNonInteractive, ...rest }) {
  return (
    <FieldSelect
      dataOptions={WORKFLOW_STATUS_OPTIONS}
      isNonInteractive={isNonInteractive}
      label={<FormattedMessage id="ui-orders.orderSummary.workflowStatus" />}
      name="workflowStatus"
      {...rest}
    />
  );
}

FieldWorkflowStatus.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
};

FieldWorkflowStatus.defaultProps = {
  disabled: false,
};

export default FieldWorkflowStatus;
