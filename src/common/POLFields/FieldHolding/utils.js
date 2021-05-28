const getCallNumber = (callNumber = '', callNumberPrefix = '', callNumberSuffix = '') => (
  `${callNumberPrefix}${callNumber}${callNumberSuffix}`.trim()
);

export const getHoldingOptions = (holdings = [], locationsMap) => (
  holdings.map(({ id, permanentLocationId, callNumber, callNumberPrefix, callNumberSuffix }) => {
    const callNumberLabel = getCallNumber(callNumber, callNumberPrefix, callNumberSuffix);
    const separator = callNumberLabel ? ' > ' : '';

    return ({
      value: id,
      label: `${locationsMap[permanentLocationId].name}${separator}${callNumberLabel}`,
    });
  })
);
