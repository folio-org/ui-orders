import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { ORDER_INVOICE_RELNS_API } from '../../../Utils/api';
import { useOrderInvoiceRelationships } from './useOrderInvoiceRelationships';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const orderInvoiceRelationships = [{}];

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({
      totalRecords: orderInvoiceRelationships.length,
      orderInvoiceRelationships,
    }),
  })),
};

describe('useOrderInvoiceRelationships', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch order invoice relationships', async () => {
    const orderId = 'orderId';
    const { result } = renderHook(() => useOrderInvoiceRelationships(orderId), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(
      ORDER_INVOICE_RELNS_API,
      expect.objectContaining({
        searchParams: expect.objectContaining({
          query: `purchaseOrderId=="${orderId}"`,
        }),
        signal: expect.any(AbortSignal),
      }),
    );
    expect(result.current.orderInvoiceRelationships).toEqual(orderInvoiceRelationships);
  });
});
