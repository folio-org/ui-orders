// eslint-disable-next-line import/prefer-default-export
export const getClosingReasonsOptions = (closingReasons = []) => (
  closingReasons.map(({ reason }) => ({
    label: reason,
    value: reason,
  })));
