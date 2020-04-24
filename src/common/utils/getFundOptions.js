// eslint-disable-next-line import/prefer-default-export
export const getFundOptions = (funds = []) => funds.map(fund => ({
  value: fund.id,
  label: fund.code,
}));
