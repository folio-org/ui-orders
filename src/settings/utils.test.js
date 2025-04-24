import { validateDuplicates } from './utils';

describe('validateDuplicates', () => {
  const mockIntl = {
    formatMessage: jest.fn(({ id }) => id),
  };

  it('should return an empty object when there are no duplicates', () => {
    const fieldNames = ['name'];
    const items = [
      { name: 'Item1' },
      { name: 'Item2' },
      { name: 'Item3' },
    ];
    const validator = validateDuplicates(mockIntl, fieldNames);

    items.forEach((item, index) => {
      const result = validator(item, index, items);

      expect(result).toEqual({});
    });
  });

  it('should return an error message for duplicate fields', () => {
    const fieldNames = ['name'];
    const items = [
      { name: 'Item1' },
      { name: 'Item2' },
      { name: 'Item1' },
    ];
    const validator = validateDuplicates(mockIntl, fieldNames);

    const result = validator(items[2], 2, items);

    expect(result.name).toEqual('ui-orders.settings.orderTemplateCategories.validation.duplicates');
  });

  it('should validate multiple fields for duplicates', () => {
    const fieldNames = ['name', 'code'];
    const items = [
      { name: 'Item1', code: 'Code1' },
      { name: 'Item2', code: 'Code2' },
      { name: 'Item1', code: 'Code2' },
    ];
    const validator = validateDuplicates(mockIntl, fieldNames);

    const result = validator(items[2], 2, items);

    expect(result.name).toEqual('ui-orders.settings.orderTemplateCategories.validation.duplicates');
    expect(result.code).toEqual('ui-orders.settings.orderTemplateCategories.validation.duplicates');
  });

  it('should return an empty object if no fields are provided', () => {
    const fieldNames = [];
    const items = [
      { name: 'Item1' },
      { name: 'Item2' },
    ];
    const validator = validateDuplicates(mockIntl, fieldNames);

    items.forEach((item, index) => {
      const result = validator(item, index, items);

      expect(result).toEqual({});
    });
  });
});
