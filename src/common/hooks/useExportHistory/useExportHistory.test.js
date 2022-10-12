import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { orderLine, exportHistory } from '../../../../test/jest/fixtures';
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
    const { result, waitFor } = renderHook(() => useExportHistory(), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(getMock).not.toHaveBeenCalled();
  });

  it('should fetch export history by PO Line IDs', async () => {
    const { result, waitFor } = renderHook(() => useExportHistory([orderLine.id]), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(getMock).toHaveBeenCalled();
    expect(result.current.exportHistory).toEqual([exportHistory]);
  });
});
