import { getRecordMap } from './getRecordMap';

const records = [{
  id: 'id',
  value: 'value',
}];

const recordMap = {
  'id': { id: 'id', value: 'value' },
};

describe('getRecordMap', () => {
  it('should return object', () => {
    expect(getRecordMap(records)).toEqual(recordMap);
  });
});
