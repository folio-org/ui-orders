import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { orderLine } from '../../../../test/jest/fixtures';
import { useOrderLine } from './useOrderLine';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useOrderLine', () => {
  it('should fetch order line by id', async () => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve(orderLine),
        }),
      });

    const { result, waitForNextUpdate } = renderHook(() => useOrderLine(orderLine.id), { wrapper });

    await waitForNextUpdate();

    expect(result.current.orderLine).toEqual(orderLine);
  });
});
