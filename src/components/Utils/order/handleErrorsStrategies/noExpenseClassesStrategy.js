export const noExpenseClassesStrategy = ({ callout }) => {
  const handle = (errorsContainer) => {
    const fundCode = errorsContainer.getError().getParameter('fundCode');
    const expenseClassName = errorsContainer.getError().getParameter('expenseClassName');

    callout.sendCallout({
      messageId: `ui-orders.errors.${errorsContainer.code}`,
      type: 'error',
      values: { fundCode, expenseClassName },
    });
  };

  return { handle };
};
