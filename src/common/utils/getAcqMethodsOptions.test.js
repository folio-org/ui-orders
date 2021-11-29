import { getAcqMethodsOptions } from './getAcqMethodsOptions';

const records = [
  { id: '001', value: 'Purchase' },
  { id: '002', value: 'Other' },
];

describe('getAcqMethodsOptions', () => {
  it('should return all acq methods options', () => {
    expect(getAcqMethodsOptions(records).length).toEqual(records.length);
  });

  it('should return empty list if there is no acq methods', () => {
    expect(getAcqMethodsOptions()).toEqual([]);
  });
});
