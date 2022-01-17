import { some } from 'lodash';

import {
  ORDER_STATUSES,
  RECEIPT_STATUS,
} from '@folio/stripes-acq-components';

const isLineAbleToBeReceived = (line = { cost: {} }) => {
  const isNotCheckin = !line.checkinItems;
  const hasQuantity = Boolean(line.cost.quantityPhysical || line.cost.quantityElectronic);
  const hasCorrectReceiptStatus = !([
    RECEIPT_STATUS.pending,
    RECEIPT_STATUS.receiptNotRequired,
  ].includes(line.receiptStatus));

  return isNotCheckin && hasQuantity && hasCorrectReceiptStatus;
};

const isWorkflowStatusNotPending = (order) => {
  const { workflowStatus } = order;

  return workflowStatus !== ORDER_STATUSES.pending;
};

export const isWorkflowStatusIsPending = (order) => {
  const { workflowStatus } = order;

  return workflowStatus === ORDER_STATUSES.pending;
};

export const isWorkflowStatusOpen = (order) => {
  const { workflowStatus } = order;

  return workflowStatus === ORDER_STATUSES.open;
};

export const isWorkflowStatusClosed = ({ workflowStatus }) => workflowStatus === ORDER_STATUSES.closed;

export const isReceiveAvailableForLine = (line = {}, order = {}) => {
  const hasLineItemsToReceive = isLineAbleToBeReceived(line);

  return hasLineItemsToReceive && isWorkflowStatusNotPending(order);
};

export const isCheckInAvailableForLine = (line = {}, order = {}) => {
  return line.checkinItems && isWorkflowStatusNotPending(order);
};

export const isReceiveAvailableForOrder = (order = {}) => {
  const { compositePoLines = [] } = order;
  const hasLineItemsToReceive = some(compositePoLines, isLineAbleToBeReceived);

  return hasLineItemsToReceive && isWorkflowStatusNotPending(order);
};

export const isOpenAvailableForOrder = (isApprovalRequired, order = {}) => {
  const { approved, compositePoLines = [] } = order;

  return isWorkflowStatusIsPending(order) && compositePoLines.length > 0 && (approved || !isApprovalRequired);
};

export const isReopenAvailableForOrder = (order = {}) => {
  const { compositePoLines = [] } = order;
  const hasLineItemsToReceive = some(compositePoLines, isLineAbleToBeReceived);

  return hasLineItemsToReceive && isWorkflowStatusNotPending(order);
};

export const ifDisabledToChangePaymentInfo = (order = {}) => {
  return !(isWorkflowStatusIsPending(order) || isWorkflowStatusOpen(order));
};

export const isOrderManual = (order = {}) => order?.manualPo === true;
