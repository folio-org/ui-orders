export const getCallNumber = (callNumber = '', callNumberPrefix = '', callNumberSuffix = '') => (
  `${callNumberPrefix}${callNumber}${callNumberSuffix}`.trim()
);
