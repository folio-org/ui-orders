import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useAcqMethod } from './useAcqMethod';

const queryClient = new QueryClient();

const acqMethod = { id: 'acqMethodId', value: 'ACQ Method' };

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useAcqMethod', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve(acqMethod),
        }),
      });
  });

  it('should fetch acq method by id', async () => {
    const { result } = renderHook(() => useAcqMethod(acqMethod.id), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.acqMethod).toEqual(acqMethod);
  });
});
