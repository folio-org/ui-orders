import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useIntl } from 'react-intl';
import { getFullName } from '@folio/stripes/util';
import { useSelectedPOVersionMethods } from './useSelectedPOVersionMethods';

jest.mock('react-intl', () => ({
  useIntl: jest.fn(),
}));

jest.mock('@folio/stripes/util', () => ({
  getFullName: jest.fn(),
}));

describe('useSelectedPOVersionMethods', () => {
  let intlMock;

  beforeEach(() => {
    intlMock = {
      formatMessage: jest.fn(({ id }) => id),
    };
    useIntl.mockReturnValue(intlMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return object property by ID if ID and property exist in the map', () => {
    const { result } = renderHook(() => useSelectedPOVersionMethods());

    const obj = {
      id1: { property1: 'value1', property2: 'value2' },
      id2: { property1: 'value3' },
    };

    const value = result.current.getObjectPropertyById('id1', obj, 'property1');

    expect(value).toBe('value1');
  });

  test('should return null when ID is not provided', () => {
    const { result } = renderHook(() => useSelectedPOVersionMethods());
    const obj = { id1: { property1: 'value1' } };

    const value = result.current.getObjectPropertyById(null, obj, 'property1');

    expect(value).toBeNull();
  });

  test('should return deletedRecordLabel when ID is not found in the object', () => {
    const { result } = renderHook(() => useSelectedPOVersionMethods());

    const obj = { id1: { property1: 'value1' } };
    const value = result.current.getObjectPropertyById('id2', obj, 'property1');

    expect(value).toBe('stripes-acq-components.versionHistory.deletedRecord');
  });

  test('should return null when ID is not provided for getUserFullnameById', () => {
    const { result } = renderHook(() => useSelectedPOVersionMethods());
    const usersMap = { user1: { firstName: 'John', lastName: 'Doe' } };

    const value = result.current.getUserFullnameById(null, usersMap);

    expect(value).toBeNull();
  });

  test('should return user full name by ID using the users map', () => {
    getFullName.mockReturnValue('John Doe');
    const { result } = renderHook(() => useSelectedPOVersionMethods());

    const usersMap = { user1: { firstName: 'John', lastName: 'Doe' } };
    const value = result.current.getUserFullnameById('user1', usersMap);

    expect(getFullName).toHaveBeenCalledWith(usersMap.user1);
    expect(value).toBe('John Doe');
  });

  test('should return deletedRecordLabel when ID is not found in the users map', () => {
    const { result } = renderHook(() => useSelectedPOVersionMethods());

    const usersMap = { user1: { firstName: 'John', lastName: 'Doe' } };
    const value = result.current.getUserFullnameById('user2', usersMap);

    expect(value).toBe('stripes-acq-components.versionHistory.deletedRecord');
  });
});
