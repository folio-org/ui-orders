import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { LINES_LIMIT_DEFAULT } from '../../../components/Utils/const';
import { useLinesLimit } from './useLinesLimit';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const linesLimit = '3';

describe('useLinesLimit', () => {
  it('should return default lines limit config', async () => {
    useOkapiKy.mockClear();

    const { result } = renderHook(() => useLinesLimit(false), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.linesLimit).toBe(LINES_LIMIT_DEFAULT);
  });

  it('should return lines limit config', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          configs: [{ value: linesLimit }],
        }),
      }),
    });

    const { result } = renderHook(() => useLinesLimit(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.linesLimit).toBe(Number(linesLimit));
  });
});
