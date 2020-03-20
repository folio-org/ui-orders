import React from 'react';
import { FormattedMessage } from 'react-intl';

// eslint-disable-next-line import/prefer-default-export
export const PO_WORKFLOW_STATUSES = {
  pending: 'Pending',
  open: 'Open',
  closed: 'Closed',
};

export const WORKFLOW_STATUS = PO_WORKFLOW_STATUSES;

export const WORKFLOW_STATUS_LABELS = {
  [PO_WORKFLOW_STATUSES.pending]: <FormattedMessage id="ui-orders.workflowStatus.pending" />,
  [PO_WORKFLOW_STATUSES.open]: <FormattedMessage id="ui-orders.workflowStatus.open" />,
  [PO_WORKFLOW_STATUSES.closed]: <FormattedMessage id="ui-orders.workflowStatus.closed" />,
};
