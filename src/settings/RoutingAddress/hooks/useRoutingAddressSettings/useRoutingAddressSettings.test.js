import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { ROUTING_USER_ADDRESS_TYPE_ID } from '../../constants';
import { useRoutingAddressSettings } from './useRoutingAddressSettings';

const routingAddressConfig = {
  id: '9465105a-e8a1-470c-9817-142d33bc4fcd',
  key: ROUTING_USER_ADDRESS_TYPE_ID,
  value: 'Claim',
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useRoutingAddressSettings', () => {
  it('should fetch routing address configuration', async () => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({ settings: [routingAddressConfig] }),
        }),
      });

    const { result } = renderHook(() => useRoutingAddressSettings(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.data).toEqual(routingAddressConfig);
  });
});
