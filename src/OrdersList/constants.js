import React from 'react';
import { FormattedMessage } from 'react-intl';

import { WORKFLOW_STATUS } from '../components/PurchaseOrder/Summary/FieldWorkflowStatus';
import { ORDER_TYPE } from '../components/PurchaseOrder/PODetails/FieldOrderType';
import { RECEIPT_STATUS } from '../components/POLine/POLineDetails/FieldReceiptStatus';
import { PAYMENT_STATUS } from '../components/POLine/POLineDetails/FieldPaymentStatus';
import { ACQUISITION_METHOD } from '../components/POLine/POLineDetails/FieldAcquisitionMethod';
import { ORDER_FORMAT } from '../components/POLine/POLineDetails/FieldOrderFormat';

export const FILTERS = {
  APPROVED: 'approved',
  ASSIGNED_TO: 'assignedTo',
  CLOSE_REASON: 'closeReason',
  CREATED_BY: 'createdByUserId',
  DATE_CREATED: 'createdDate',
  DATE_ORDERED: 'dateOrdered',
  MANUAL_RENEWAL: 'manualRenewal',
  ORDER_TYPE: 'orderType',
  PO_NUMBER: 'poNumber',
  RE_ENCUMBER: 'reEncumber',
  RENEWAL_DATE: 'renewalDate',
  RENEWAL_REVIEW_PERIOD: 'renewalReviewPeriod',
  STATUS: 'workflowStatus',
  VENDOR: 'vendor',
};

export const STATUS_FILTER_OPTIONS = Object.keys(WORKFLOW_STATUS).map(status => ({
  value: WORKFLOW_STATUS[status],
  label: <FormattedMessage id={`ui-orders.workflowStatus.${status}`} />,
}));

export const RECEIPT_STATUS_FILTER_OPTIONS = Object.keys(RECEIPT_STATUS).map(status => ({
  value: RECEIPT_STATUS[status],
  label: <FormattedMessage id={`ui-orders.receipt_status.${status}`} />,
}));

export const PAYMENT_STATUS_FILTER_OPTIONS = Object.keys(PAYMENT_STATUS).map(status => ({
  value: PAYMENT_STATUS[status],
  label: <FormattedMessage id={`ui-orders.payment_status.${status}`} />,
}));

export const ACQUISITION_METHOD_FILTER_OPTIONS = Object.keys(ACQUISITION_METHOD).map(key => ({
  value: ACQUISITION_METHOD[key],
  label: <FormattedMessage id={`ui-orders.acquisition_method.${key}`} />,
}));

export const ORDER_FORMAT_FILTER_OPTIONS = Object.keys(ORDER_FORMAT).map(key => ({
  value: ORDER_FORMAT[key],
  label: <FormattedMessage id={`ui-orders.order_format.${key}`} />,
}));

export const ORDER_TYPE_FILTER_OPTIONS = Object.keys(ORDER_TYPE).map(key => ({
  value: ORDER_TYPE[key],
  label: <FormattedMessage id={`ui-orders.order_type.${key}`} />,
}));
