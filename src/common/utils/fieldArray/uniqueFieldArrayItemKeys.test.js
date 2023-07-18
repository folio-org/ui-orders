import { FIELD_ARRAY_ITEM_IDENTIFIER_KEY } from '../../constants';
import {
  injectUniqueFieldArrayItemKeys,
  omitUniqueFieldArrayItemKeys,
} from './uniqueFieldArrayItemKeys';

const values = {
  foo: [
    { locationId: 'locationId', quantity: 2 },
    { locationId: 'locationId', quantity: 1 },
    { holdingId: 'holdingId', quantity: 3 },
    { holdingId: 'holdingId', quantity: 3 },
  ],
  bar: {
    baz: [
      { name: 'name', description: 'test description' },
      { name: 'name', description: 'test description' },
      { name: 'name', description: 'test description' },
    ],
  },
};

const fieldArrayPaths = ['foo', 'bar.baz'];

describe('injectUniqueFieldArrayItemKeys', () => {
  it('should populate field array items with unique identifiers', () => {
    const hydratedValues = injectUniqueFieldArrayItemKeys(values, fieldArrayPaths);

    expect(
      new Set(hydratedValues.foo.map(item => item[FIELD_ARRAY_ITEM_IDENTIFIER_KEY])).size,
    ).toBe(hydratedValues.foo.length);
    expect(
      new Set(hydratedValues.bar.baz.map(item => item[FIELD_ARRAY_ITEM_IDENTIFIER_KEY])).size,
    ).toBe(hydratedValues.bar.baz.length);
  });
});

describe('omitUniqueFieldArrayItemKeys', () => {
  it('should cleanup field array items values from unique identifiers', () => {
    const hydratedValues = injectUniqueFieldArrayItemKeys(values, fieldArrayPaths);
    const dehydratedValues = omitUniqueFieldArrayItemKeys(hydratedValues, fieldArrayPaths);

    expect(dehydratedValues.foo.map(item => item[FIELD_ARRAY_ITEM_IDENTIFIER_KEY]).filter(Boolean)).toHaveLength(0);
    expect(dehydratedValues.bar.baz.map(item => item[FIELD_ARRAY_ITEM_IDENTIFIER_KEY]).filter(Boolean)).toHaveLength(0);
  });
});
