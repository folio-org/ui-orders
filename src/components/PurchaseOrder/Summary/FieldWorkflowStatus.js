import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { FieldSelect } from '@folio/stripes-acq-components';

export const WORKFLOW_STATUS = {
  closed: 'Closed',
  open: 'Open',
  pending: 'Pending',
};

const WORKFLOW_STATUS_OPTIONS = Object.keys(WORKFLOW_STATUS).map((key) => ({
  labelId: `ui-orders.workflowStatus.${key}`,
  value: WORKFLOW_STATUS[key],
}));

class FieldWorkflowStatus extends Component {
  render() {
    return (
      <FieldSelect
        dataOptions={WORKFLOW_STATUS_OPTIONS}
        label={<FormattedMessage id="ui-orders.orderSummary.workflowStatus" />}
        name="workflowStatus"
      />
    );
  }
}

export default FieldWorkflowStatus;
