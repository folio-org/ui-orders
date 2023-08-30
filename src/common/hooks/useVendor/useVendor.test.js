import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useVendor } from './useVendor';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useVendor', () => {
  it('should fetch vendor', async () => {
    const vendor = {
      id: 'uidVendor',
      name: 'AMAZON',
    };

    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => vendor,
      }),
    });

    const { result } = renderHook(() => useVendor('uid'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.vendor).toEqual(vendor);
  });
});
