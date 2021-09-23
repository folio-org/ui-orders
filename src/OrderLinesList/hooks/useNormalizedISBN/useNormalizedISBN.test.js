import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useNormalizedISBN } from './useNormalizedISBN';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const isbnNumber = '90097';
const identifierType = { id: 'identifierTypeId' };

describe('useNormalizedISBN', () => {
  it('should return fetchISBN to verify isbn', async () => {
    useOkapiKy.mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({
            isbn: isbnNumber,
            identifierTypes: [],
          }),
        }),
      });

    const { result } = renderHook(() => useNormalizedISBN(isbnNumber), { wrapper });

    const { data } = await result.current.fetchISBN();

    expect(data.isbn).toBe(isbnNumber);
  });

  it('should return fetchISBN to verify isbn type', async () => {
    useOkapiKy.mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({
            identifierTypes: [identifierType],
          }),
        }),
      });

    const { result } = renderHook(() => useNormalizedISBN(isbnNumber), { wrapper });

    const { data } = await result.current.fetchISBN();

    expect(data.isbnType).toBe(identifierType.id);
  });
});
