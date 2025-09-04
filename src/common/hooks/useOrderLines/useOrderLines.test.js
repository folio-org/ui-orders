import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { LINES_API } from '@folio/stripes-acq-components';

import { useOrderLines } from './useOrderLines';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const orderLines = [{ id: 'order-line-id' }];

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({
      totalRecords: orderLines.length,
      poLines: orderLines,
    }),
  })),
};

describe('useOrderLines', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch order lines', async () => {
    const { result } = renderHook(() => useOrderLines(), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(LINES_API, expect.any(Object));
    expect(result.current.orderLines).toEqual(orderLines);
  });
});
