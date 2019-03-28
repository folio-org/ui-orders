import React from 'react';
import { values } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { WORKFLOW_STATUS } from '../PurchaseOrder/Summary/FieldWorkflowStatus';

const Filters = () => {
  return [
    {
      label: 'Assigned to me',
      name: 'assignedTo',
      cql: 'assignedTo',
      values: [],
    },
    {
      label: <FormattedMessage id="ui-orders.order.workflow_status" />,
      name: 'workflowStatus',
      cql: 'workflowStatus',
      values: values(WORKFLOW_STATUS),
    },
  ];
};

const SearchableIndexes = [
  { label: 'All', value: 'all', makeQuery: term => `(id="${term}*" or poNumber="${term}*" or vendor="${term}*" or assignedTo="${term}*")` },
  { label: 'ID', value: 'id', makeQuery: term => `(id="${term}*")` },
  { label: 'PO Number', value: 'poNumber', makeQuery: term => `(poNumber="${term}*")` },
  { label: 'Vendor', value: 'vendor', makeQuery: term => `(vendor="${term}*")` },
  { label: 'Assigned To', value: 'assignedTo', makeQuery: term => `(assignedTo="${term}*")` },
];

export { Filters, SearchableIndexes };
