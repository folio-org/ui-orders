import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useInstance } from './useInstance';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const instanceId = 'instanceId';

describe('useInstance', () => {
  it('should fetch instance', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          id: instanceId,
        }),
      }),
    });

    const { result, waitFor } = renderHook(() => useInstance(instanceId), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.instance.id).toBe(instanceId);
  });
});
