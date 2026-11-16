const replaceOrderLine = (orderLines, line) => orderLines.map((orderLine) => (
  orderLine.id === line.id ? { ...orderLine, ...line } : orderLine
));

// The order lines as they will be once the edited (or new) line has been saved
export const getOrderLinesAfterSave = (orderLines = [], line) => {
  const isLineInOrder = orderLines.some(({ id }) => id === line.id);

  return isLineInOrder ? replaceOrderLine(orderLines, line) : [...orderLines, line];
};
