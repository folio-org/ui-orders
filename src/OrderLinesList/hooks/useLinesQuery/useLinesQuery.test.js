import queryString from 'query-string';
import { renderHook } from '@testing-library/react-hooks';

import {
  SEARCH_INDEX_PARAMETER,
} from '@folio/stripes-acq-components';

import { useNormalizedISBN } from '../useNormalizedISBN';
import { useLinesQuery } from './useLinesQuery';

jest.mock('../useNormalizedISBN', () => ({
  useNormalizedISBN: jest.fn(),
}));

const isbnData = {
  isbn: '909934',
  isbnType: 'isbnTypeId',
};

describe('useLinesQuery', () => {
  let fetchISBNMock;

  beforeEach(() => {
    fetchISBNMock = jest.fn().mockReturnValue(Promise.resolve({}));

    useNormalizedISBN.mockClear().mockReturnValue({ fetchISBN: fetchISBNMock });
  });

  it('should return function, that returns query when isbn is not enabled', async () => {
    const search = '?foo=bar';
    const { result } = renderHook(() => useLinesQuery(queryString.parse(search)));
    const query = await result.current();

    expect(query).toBe('(foo=="bar") sortby metadata.updatedDate/sort.descending');
  });

  it('should return function, that returns query when isbn is enabled and correct', async () => {
    const search = `?foo=bar&${SEARCH_INDEX_PARAMETER}=productIdISBN`;

    fetchISBNMock.mockReturnValue(Promise.resolve({ data: isbnData }));

    const { result } = renderHook(() => useLinesQuery(queryString.parse(search)));
    const query = await result.current();

    expect(query).toBe('(foo=="bar") sortby metadata.updatedDate/sort.descending');
  });

  it('should return function, that returns undefined when isbn is incorrect', async () => {
    const search = `?foo=bar&${SEARCH_INDEX_PARAMETER}=productIdISBN`;

    fetchISBNMock.mockReturnValue(Promise.resolve({ isError: true }));

    const { result } = renderHook(() => useLinesQuery(queryString.parse(search)));
    const query = await result.current();

    expect(query).not.toBeDefined();
  });
});
