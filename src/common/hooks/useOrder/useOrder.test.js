import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useOrder } from './useOrder';
import { order } from '../../../../test/jest/fixtures';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useOrder', () => {
  it('should fetch order by id', async () => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => order,
        }),
      });

    const { result, waitForNextUpdate } = renderHook(() => useOrder(order.id), { wrapper });

    await waitForNextUpdate();

    expect(result.current.order).toEqual(order);
  });
});
