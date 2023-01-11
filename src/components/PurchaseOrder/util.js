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

export const getPoFieldsLabelMap = () => {
  return {
    'tags': 'stripes-acq-components.label.tags',
    'tags.tagList': 'stripes-acq-components.label.tags',
    'tags.tagList[\\d]': 'stripes-acq-components.label.tags',
    'template': 'ui-orders.settings.orderTemplates.editor.template.name',
    'approvedById': 'ui-orders.orderDetails.approvedBy',

    // PO details fields
    'poNumber': 'ui-orders.orderDetails.poNumber',
    'poNumberPrefix': 'ui-orders.orderDetails.orderNumberPrefix',
    'poNumberSuffix': 'ui-orders.orderDetails.orderNumberSuffix',
    'vendor': 'ui-orders.orderDetails.vendor',
    'orderType': 'ui-orders.orderDetails.orderType',
    'acqUnitIds': 'stripes-acq-components.label.acqUnits',
    'acqUnitIds[\\d]': 'stripes-acq-components.label.acqUnits',
    'approvalDate': 'ui-orders.orderDetails.approvalDate',
    'assignedTo': 'ui-orders.orderDetails.assignedTo',
    'billTo': 'ui-orders.orderDetails.billTo',
    'shipTo': 'ui-orders.orderDetails.shipTo',
    'manualPo': 'ui-orders.orderDetails.manualPO',
    'reEncumber': 'ui-orders.orderDetails.reEncumber',
    'metadata.createdByUserId': 'ui-orders.orderDetails.createdBy',
    'metadata.createdDate': 'ui-orders.orderDetails.createdOn',
    'metadata.updatedDate': 'ui-orders.order.lastUpdated',
    'dateOrdered': 'ui-orders.orderDetails.dateOpened',
    'notes': 'ui-orders.orderDetails.note',
    'notes[\\d]': 'ui-orders.orderDetails.note',

    // Ongoing fields
    'ongoing.isSubscription': 'ui-orders.renewals.subscription',
    'ongoing.interval': 'ui-orders.renewals.renewalInterval',
    'ongoing.renewalDate': 'ui-orders.renewals.renewalDate',
    'ongoing.reviewPeriod': 'ui-orders.renewals.reviewPeriod',
    'ongoing.manualRenewal': 'ui-orders.renewals.manualRenewal',
    'ongoing.reviewDate': 'ui-orders.renewals.reviewDate',
    'ongoing.notes': 'ui-orders.renewals.notes',

    // Summary fields
    'totalItems': 'ui-orders.orderSummary.totalUnits',
    'approved': 'ui-orders.orderSummary.approved',
    'workflowStatus': 'ui-orders.orderSummary.workflowStatus',
    'totalEstimatedPrice': 'ui-orders.orderSummary.totalEstimatedPrice',
    'totalEncumbered': 'ui-orders.orderSummary.totalEncumbered',
    'totalExpended': 'ui-orders.orderSummary.totalExpended',
    'closeReason': 'ui-orders.orderSummary.closingReason',
    'closeReason.reason': 'ui-orders.orderSummary.closingReason',
    'closeReason.note': 'ui-orders.orderSummary.closingNote',
  };
};
