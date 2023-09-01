import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { orderLine, exportHistory } from 'fixtures';
import { useExportHistory } from './useExportHistory';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useExportHistory', () => {
  const getMock = jest.fn(() => ({
    json: () => Promise.resolve({
      exportHistories: [exportHistory],
      totalRecords: 1,
    }),
  }));

  beforeEach(() => {
    getMock.mockClear();
    useOkapiKy.mockClear().mockReturnValue({
      get: getMock,
    });
  });

  it('should NOT fetch export history if PO Line IDs are not provided', async () => {
    const { result } = renderHook(() => useExportHistory(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(getMock).not.toHaveBeenCalled();
  });

  it('should fetch export history by PO Line IDs', async () => {
    const { result } = renderHook(() => useExportHistory([orderLine.id]), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(getMock).toHaveBeenCalled();
    expect(result.current.exportHistory).toEqual([exportHistory]);
  });
});
