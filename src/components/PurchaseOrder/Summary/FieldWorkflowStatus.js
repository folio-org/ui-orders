import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  FieldSelectFinal as FieldSelect,
  ORDER_STATUSES,
} from '@folio/stripes-acq-components';

import WorkflowStatus from './WorkflowStatus';

const WORKFLOW_STATUS_OPTIONS = Object.keys(ORDER_STATUSES).map((key) => ({
  labelId: `ui-orders.workflowStatus.${key}`,
  value: ORDER_STATUSES[key],
}));

function FieldWorkflowStatus({ disabled, isNonInteractive }) {
  return isNonInteractive
    ? <WorkflowStatus value={isNonInteractive} />
    : (
      <FieldSelect
        dataOptions={WORKFLOW_STATUS_OPTIONS}
        disabled={disabled}
        label={<FormattedMessage id="ui-orders.orderSummary.workflowStatus" />}
        name="workflowStatus"
      />
    );
}

FieldWorkflowStatus.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.node,
};

FieldWorkflowStatus.defaultProps = {
  disabled: false,
};

export default FieldWorkflowStatus;
