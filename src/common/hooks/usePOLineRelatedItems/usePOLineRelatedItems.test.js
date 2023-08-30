import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { orderLine } from 'fixtures/orderLine';
import { usePOLineRelatedItems } from './usePOLineRelatedItems';

const items = [{
  id: 'itemId',
  purchaseOrderLineIdentifier: orderLine.id,
}];

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('usePOLineRelatedItems', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({
            items,
            totalRecords: items.length,
          }),
        }),
      });
  });

  it('should return items related to POLine', async () => {
    const { result } = renderHook(() => usePOLineRelatedItems(orderLine), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.items).toEqual(items);
  });
});
