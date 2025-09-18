import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { usePOLinePiecesExistence } from './usePOLinePiecesExistence';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const jsonMock = jest.fn(() => Promise.resolve({ totalRecords: 1 }));

describe('usePOLinePiecesExistence', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: jsonMock,
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct "isExist" when PO line has pieces', async () => {
    const { result } = renderHook(() => usePOLinePiecesExistence('poLine'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.isExist).toBeTruthy();
  });

  it('should return correct "isExist" when PO line does not have pieces', async () => {
    jsonMock.mockReturnValueOnce(Promise.resolve({ totalRecords: 0 }));

    const { result } = renderHook(() => usePOLinePiecesExistence('poLine', { receivingStatus: 'Expected' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.isExist).toBeFalsy();
  });
});
