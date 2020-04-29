import { cloneDeep, omit } from 'lodash';

const saveOrder = (order, mutator) => {
  let method = mutator.POST;

  delete order.createdByName;
  delete order.assignedToUser;
  delete order.vendorName;

  if (order.id) {
    method = mutator.PUT;
    delete order.compositePoLines;
  }

  return method(order);
};

export const getFullOrderNumber = ({ poNumberPrefix = '', poNumberSuffix = '', poNumber = '' } = {}) => (
  `${poNumberPrefix}${poNumber}${poNumberSuffix}`.trim()
);

export const updateOrderResource = (order, mutator, changedProps) => {
  const clonedOrder = cloneDeep(order);

  Object.assign(clonedOrder, changedProps);

  return saveOrder(clonedOrder, mutator);
};

export const createOrEditOrderResource = (orderFormValues, mutator, changedProps) => {
  const clonedOrder = cloneDeep(orderFormValues);

  Object.assign(clonedOrder, changedProps);

  return saveOrder(clonedOrder, mutator);
};

export const cloneOrder = (order, mutator, lines) => {
  const clonedOrder = omit(
    order,
    ['id', 'adjustment', 'metadata', 'poNumber', 'poNumberPrefix', 'poNumberSuffix', 'workflowStatus', 'compositePoLines'],
  );

  if (lines) {
    clonedOrder.compositePoLines = lines.map(line => omit(line, ['id', 'purchaseOrderId', 'metadata']));
  }

  return saveOrder(clonedOrder, mutator);
};
