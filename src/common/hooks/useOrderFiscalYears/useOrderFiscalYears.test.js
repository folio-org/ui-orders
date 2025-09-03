import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { ORDERS_API } from '@folio/stripes-acq-components';

import { useOrderFiscalYears } from './useOrderFiscalYears';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const fiscalYears = [{ id: 'fiscal-year-id' }];

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({
      totalRecords: fiscalYears.length,
      fiscalYears,
    }),
  })),
};

describe('useOrderFiscalYears', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch order related fiscal years', async () => {
    const { result } = renderHook(() => useOrderFiscalYears('orderId'), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(`${ORDERS_API}/orderId/fiscalYears`, expect.any(Object));
    expect(result.current.fiscalYears).toEqual(fiscalYears);
  });
});
