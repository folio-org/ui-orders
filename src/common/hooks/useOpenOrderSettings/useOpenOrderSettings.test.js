import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useOpenOrderSettings, defaultConfig } from './useOpenOrderSettings';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useOpenOrderSettings', () => {
  it('should return open order config', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          totalRecords: 1,
          configs: [{ value: '{"isOpenOrderEnabled":false,"isDuplicateCheckDisabled":false}' }],
        }),
      }),
    });

    const { result } = renderHook(() => useOpenOrderSettings(), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.openOrderSettings).toEqual(defaultConfig);
  });
});
