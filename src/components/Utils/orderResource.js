import { cloneDeep, omit } from 'lodash';

const saveOrder = (order, mutator) => {
  let method = mutator.POST;

  delete order.createdByName;
  delete order.assignedToUser;
  delete order.vendorName;
  delete order.numberPrefix;
  delete order.numberSuffix;

  if (order.id) {
    method = mutator.PUT;
    delete order.compositePoLines;
  }

  if (!order.metadata?.createdByUserId) delete order.metadata; // fix sample data

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

export const cloneOrder = (order, mutator, lines) => {
  const clonedOrder = omit(order, ['id', 'adjustment', 'metadata', 'poNumber', 'workflowStatus', 'compositePoLines']);

  if (lines) {
    clonedOrder.compositePoLines = lines.map(line => omit(line, ['id', 'purchaseOrderId', 'metadata']));
  }

  return saveOrder(clonedOrder, mutator);
};
