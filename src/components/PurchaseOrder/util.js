import { some } from 'lodash';

import { WORKFLOW_STATUS } from './Summary/FieldWorkflowStatus';
import { RECEIPT_STATUS } from '../POLine/POLineDetails/FieldReceiptStatus';

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

  return workflowStatus !== WORKFLOW_STATUS.pending;
};

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

const EMPTY_OPTION = {
  label: '',
  value: '',
};

export const addEmptyOption = (options = []) => [EMPTY_OPTION, ...options];

export const getAddresses = (addresses) => {
  return addresses.map(address => {
    let value;

    try {
      value = JSON.parse(address.value);
    } catch (e) {
      value = {
        name: '',
        address: '',
      };
    }

    return {
      id: address.id,
      name: value.name,
      address: value.address,
    };
  });
};
