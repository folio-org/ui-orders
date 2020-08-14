import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldSelectFinal,
  PAYMENT_STATUS,
} from '@folio/stripes-acq-components';

import { PO_WORKFLOW_STATUSES } from '../../constants';

const PAYMENT_STATUSES_BY_ORDER_STATUS = {
  [PO_WORKFLOW_STATUSES.pending]: [
    'pending',
    'paymentNotRequired',
  ],
  [PO_WORKFLOW_STATUSES.open]: [
    'partiallyPaid',
    'paymentNotRequired',
    'fullyPaid',
    'cancelled',
  ],
  template: [
    'paymentNotRequired',
  ],
};

const FieldPaymentStatus = ({ workflowStatus }) => {
  const statuses = (PAYMENT_STATUSES_BY_ORDER_STATUS[workflowStatus] || []).map((key) => ({
    labelId: `ui-orders.payment_status.${key}`,
    value: PAYMENT_STATUS[key],
  }));

  return (
    <FieldSelectFinal
      dataOptions={statuses}
      label={<FormattedMessage id="ui-orders.poLine.paymentStatus" />}
      name="paymentStatus"
      disabled={!statuses.length}
    />
  );
};

FieldPaymentStatus.propTypes = {
  workflowStatus: PropTypes.string,
};

export default FieldPaymentStatus;
