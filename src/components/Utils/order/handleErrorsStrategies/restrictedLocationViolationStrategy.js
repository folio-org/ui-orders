export const restrictedLocationViolationStrategy = ({ callout }) => {
  const handle = (errorsContainer) => {
    const polNumber = errorsContainer.getError().getParameter('poLineNumber');

    callout.sendCallout({
      messageId: 'ui-orders.errors.openOrder.fundLocationRestrictionViolation',
      type: 'error',
      values: { polNumber },
    });
  };

  return { handle };
};
