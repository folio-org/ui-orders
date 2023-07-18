import { FIELD_ARRAY_ITEM_IDENTIFIER_KEY } from '../../constants';
import { getFieldUniqueKey } from './getFieldUniqueKey';
import { injectUniqueFieldArrayItemKeys } from './uniqueFieldArrayItemKeys';

const fields = {
  value: [
    { locationId: 'locationId', quantity: 1 },
  ],
};

describe('getFieldUniqueKey', () => {
  const index = 0;

  it('should return a field index if there is no unique identifier', () => {
    expect(getFieldUniqueKey('fieldName', index, fields)).toBe(index);
  });

  it('should define unique identifier for a form field in an array', () => {
    expect(getFieldUniqueKey('fieldName', index, injectUniqueFieldArrayItemKeys(fields, ['value'])))
      .toEqual(expect.stringMatching(new RegExp(`${FIELD_ARRAY_ITEM_IDENTIFIER_KEY}\\d`)));
  });
});
