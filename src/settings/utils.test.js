import { FormattedMessage } from 'react-intl';

import {
  validateDuplicates,
  validateName,
  validatePrefixName,
  validateSuffixName,
} from './utils';

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

describe('validateName', () => {
  it('should return an empty object when the name validates correctly', () => {
    const name = 'suf';
    expect(validateName(name)).toEqual({});
  });

  it('should return an error message for name', () => {
    const name = 'suf0c966bd2';
    const actual = validateName(name);
    const expected = (
      <FormattedMessage id='ui-orders.settings.poNumber.nameValidation' />
    );
    expect(actual.name).toEqual(expected);
  });
});

describe('validateSuffixName', () => {
  it('should return an empty object when the name validates correctly', () => {
    const props = {
      id: '0c966bd2-0ca6-43a2-9388-3a4403f19e6f',
      name: 'suf',
      description: 'Suffix for test purposes',
      deprecated: true,
    };

    expect(validateSuffixName(props)).toEqual({});
  });

  it('should return an error message for name', () => {
    const props = {
      id: '0c966bd2-0ca6-43a2-9388-3a4403f19e6f',
      name: 'suf0c966bd2',
      description: 'Suffix for test purposes',
      deprecated: true,
    };

    const actual = validateSuffixName(props);
    const expected = (
      <FormattedMessage id='ui-orders.settings.poNumber.nameValidation' />
    );
    expect(actual.name).toEqual(expected);
  });
});

describe('validatePrefixName', () => {
  it('should return an empty object when the name validates correctly', () => {
    const props = {
      id: '0c966bd2-0ca6-43a2-9388-3a4403f19e6f',
      name: 'pref',
      description: 'Prefix for test purposes',
      deprecated: true,
    };

    expect(validatePrefixName(props)).toEqual({});
  });

  it('should return an error message for name', () => {
    const props = {
      id: '0c966bd2-0ca6-43a2-9388-3a4403f19e6f',
      name: 'pref0c966bd2',
      description: 'Prefix for test purposes',
      deprecated: true,
    };

    const actual = validatePrefixName(props);
    const expected = (
      <FormattedMessage id='ui-orders.settings.poNumber.nameValidation' />
    );
    expect(actual.name).toEqual(expected);
  });
});
