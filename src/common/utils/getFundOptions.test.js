import { getFundOptions } from './getFundOptions';

const fundsMock = [{
  id: 'fund-id',
  code: 'fundcode',
}];

const optionsMock = [{
  label: fundsMock[0].code,
  value: fundsMock[0].id,
}];

describe('getFundOptions', () => {
  it('should return fund options', () => {
    expect(getFundOptions(fundsMock)).toEqual(optionsMock);
  });

  it('should return empty list if there is no fund', () => {
    expect(getFundOptions()).toEqual([]);
  });
});
