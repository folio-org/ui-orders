export const inactiveExpenseClassStrategy = ({ callout }) => {
  const handle = (errorsContainer) => {
    const error = errorsContainer.getError();
    const fundCode = error.getParameter('fundCode');
    const expenseClassName = error.getParameter('expenseClassName');

    callout.sendCallout({
      messageId: `ui-orders.errors.${error.code}`,
      type: 'error',
      values: { fundCode, expenseClassName },
    });
  };

  return { handle };
};
