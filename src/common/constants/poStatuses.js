import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ORDER_STATUSES } from '@folio/stripes-acq-components';

export const PO_WORKFLOW_STATUSES = ORDER_STATUSES;
export const WORKFLOW_STATUS = ORDER_STATUSES;

export const WORKFLOW_STATUS_LABELS = {
  [ORDER_STATUSES.pending]: <FormattedMessage id="ui-orders.workflowStatus.pending" />,
  [ORDER_STATUSES.open]: <FormattedMessage id="ui-orders.workflowStatus.open" />,
  [ORDER_STATUSES.closed]: <FormattedMessage id="ui-orders.workflowStatus.closed" />,
};
