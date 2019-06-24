import { cloneDeep } from 'lodash';

const saveOrder = (order, mutator) => {
  let method = mutator.POST;

  delete order.createdByName;
  delete order.assignedToUser;
  delete order.numberPrefix;
  delete order.numberSuffix;

  if (order.id) {
    method = mutator.PUT;
    delete order.compositePoLines;
  }

  return method(order);
};

export const updateOrderResource = (order, mutator, changedProps) => {
  const clonedOrder = cloneDeep(order);

  Object.assign(clonedOrder, changedProps);

  return saveOrder(clonedOrder, mutator);
};

export const createOrderResource = (order, mutator) => {
  const clonedOrder = cloneDeep(order);
  const { numberPrefix = '', numberSuffix = '', poNumber = '' } = clonedOrder;
  const fullOrderNumber = `${numberPrefix}${poNumber}${numberSuffix}`.trim();

  clonedOrder.poNumber = fullOrderNumber || undefined;

  return saveOrder(clonedOrder, mutator);
};

export const cloneOrder = (order, mutator, line) => {
  const clonedOrder = cloneDeep(order);

  delete clonedOrder.id;
  delete clonedOrder.adjustment;
  delete clonedOrder.poNumber;
  delete clonedOrder.workflowStatus;
  if (line) {
    delete line.purchaseOrderId;
    clonedOrder.compositePoLines = [line];
  } else {
    delete clonedOrder.compositePoLines;
  }

  return saveOrder(clonedOrder, mutator);
};
