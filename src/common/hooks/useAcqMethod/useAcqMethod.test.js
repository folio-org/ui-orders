import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

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
    const { result, waitFor } = renderHook(() => useAcqMethod(acqMethod.id), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.acqMethod).toEqual(acqMethod);
  });
});
