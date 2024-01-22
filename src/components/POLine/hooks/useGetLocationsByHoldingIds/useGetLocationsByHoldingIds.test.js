import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useGetLocationsByHoldingIds } from './useGetLocationsByHoldingIds';

const holdingIds = ['1'];
const holdingsRecords = [{
  id: '1',
  code: 'fundCode',
  permanentLocationId: '1',
}];

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useGetLocationsByHoldingIds', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({
            holdingsRecords,
            totalRecords: holdingsRecords.length,
          }),
        }),
      });
  });

  it('should return permanentLocationId list', async () => {
    const { result } = renderHook(() => useGetLocationsByHoldingIds(holdingIds), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.locationIds).toEqual([holdingsRecords[0].permanentLocationId]);
  });
});