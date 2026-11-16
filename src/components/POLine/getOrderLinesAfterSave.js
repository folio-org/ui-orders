const replaceOrderLine = (line, orderLines) => orderLines.map((orderLine) => (
  orderLine.id === line.id ? { ...orderLine, ...line } : orderLine
));

// The order lines as they will be once the edited (or new) line has been saved
export const getOrderLinesAfterSave = (line, orderLines = []) => {
  const isLineInOrder = orderLines.some(({ id }) => id === line.id);

  return isLineInOrder ? replaceOrderLine(line, orderLines) : [...orderLines, line];
};
