import { getAcqMethodsOptions } from './getAcqMethodsOptions';

const records = [
  { id: '001', value: 'Purchase' },
  { id: '002', value: 'Other' },
];

describe('getAcqMethodsOptions', () => {
  it('should return fund options', () => {
    expect(getAcqMethodsOptions(records)).toEqual(
      records.map(({ id, value }) => ({ label: value, value: id })),
    );
  });

  it('should return empty list if there is no fund', () => {
    expect(getAcqMethodsOptions()).toEqual([]);
  });
});
