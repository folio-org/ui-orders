import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

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

    const { result, waitFor } = renderHook(() => useOpenOrderSettings(), { wrapper });

    await waitFor(() => {
      return !result.current.isFetching;
    });

    expect(result.current.openOrderSettings).toEqual(defaultConfig);
  });
});
