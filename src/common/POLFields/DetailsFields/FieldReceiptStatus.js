import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FieldSelect } from '@folio/stripes-acq-components';

import { PO_WORKFLOW_STATUSES } from '../../constants';

export const RECEIPT_STATUS = {
  awaitingReceipt: 'Awaiting Receipt',
  cancelled: 'Cancelled',
  fullyReceived: 'Fully Received',
  partiallyReceived: 'Partially Received',
  pending: 'Pending',
  receiptNotRequired: 'Receipt Not Required',
};

const RECEIPT_STATUSES_BY_ORDER_STATUS = {
  [PO_WORKFLOW_STATUSES.pending]: [
    'pending',
    'receiptNotRequired',
  ],
  [PO_WORKFLOW_STATUSES.open]: [
    'partiallyReceived',
    'receiptNotRequired',
    'fullyReceived',
    'cancelled',
  ],
  template: [
    'receiptNotRequired',
  ],
};

const FieldReceiptStatus = ({ workflowStatus }) => {
  const statuses = (RECEIPT_STATUSES_BY_ORDER_STATUS[workflowStatus] || []).map((key) => ({
    labelId: `ui-orders.receipt_status.${key}`,
    value: RECEIPT_STATUS[key],
  }));

  return (
    <FieldSelect
      dataOptions={statuses}
      label={<FormattedMessage id="ui-orders.poLine.receiptStatus" />}
      name="receiptStatus"
      disabled={!statuses.length}
    />
  );
};

FieldReceiptStatus.propTypes = {
  workflowStatus: PropTypes.string,
};

export default FieldReceiptStatus;
