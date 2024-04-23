import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useUserAddressTypes } from './useUserAddressTypes';

const mockAddressTypes = [
  {
    'addressType': 'Claim',
    'id': 'b6f4d1c6-0dfa-463c-9534-f49c4f0ae090',
  },
  {
    'addressType': 'Home',
    'id': '93d3d88d-499b-45d0-9bc7-ac73c3a19880',
  },
];

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useUserAddressTypes', () => {
  it('should fetch user address types', async () => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({ addressTypes: mockAddressTypes }),
        }),
      });

    const { result } = renderHook(() => useUserAddressTypes(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.addressTypes).toEqual(mockAddressTypes);
  });
});
