export const parseOngoingOrderInfo = (order) => {
  const { ongoing: { isSubscription, notes, reviewPeriod, renewalDate, reviewDate, manualRenewal, interval } } = order;

  if (isSubscription) {
    return {
      ...order,
      ongoing: {
        isSubscription,
        notes,
        reviewPeriod,
        renewalDate,
        manualRenewal,
        interval,
      },
    };
  } else {
    return {
      ...order,
      ongoing: {
        isSubscription,
        reviewDate,
        notes,
      },
    };
  }
};
