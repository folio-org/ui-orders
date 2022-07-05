import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { orderLine } from '../../../../test/jest/fixtures/orderLine';
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
    const { result, waitFor } = renderHook(() => usePOLineRelatedItems(orderLine), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.items).toEqual(items);
  });
});
