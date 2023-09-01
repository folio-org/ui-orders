import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useAcqMethods } from './useAcqMethods';

const queryClient = new QueryClient();

const MOCK_ACQ_METHOD = { id: 'acqMethodId', value: 'ACQ Method' };

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useAcqMethods', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({ acquisitionMethods: [MOCK_ACQ_METHOD] }),
        }),
      });
  });

  it('should fetch all acq methods', async () => {
    const { result } = renderHook(() => useAcqMethods(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.acqMethods).toEqual([MOCK_ACQ_METHOD]);
  });
});
