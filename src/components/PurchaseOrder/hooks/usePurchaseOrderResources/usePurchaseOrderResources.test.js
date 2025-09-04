import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import {
  ACQUISITIONS_UNIT_MEMBERSHIPS_API,
  ACQUISITIONS_UNITS_API,
  LINES_API,
  ORDERS_API,
} from '@folio/stripes-acq-components';

import { order } from 'fixtures';
import {
  EXPORT_HISTORY_API,
  ORDER_INVOICE_RELNS_API,
} from '../../../Utils/api';
import { usePurchaseOrderResources } from './usePurchaseOrderResources';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const orderStub = {
  ...order,
  template: 'templateId',
};

const queryMappings = {
  [`${ORDERS_API}/${orderStub.id}/fiscal-years`]: () => ({
    fiscalYears: [{ id: 'fiscal-year-id' }],
    totalRecords: 1,
  }),
  [`${ORDERS_API}/${orderStub.id}`]: () => orderStub,
  [ORDER_INVOICE_RELNS_API]: () => ({
    orderInvoiceRelationships: [{ id: 'invoice-relation-id' }],
    totalRecords: 1,
  }),
  [EXPORT_HISTORY_API]: () => ({
    exportHistory: [{ id: 'export-history-id' }],
    totalRecords: 1,
  }),
  [LINES_API]: () => ({
    poLines: [{ id: 'line-item-id' }],
    totalRecords: 1,
  }),
  [ACQUISITIONS_UNITS_API]: () => [],
  [ACQUISITIONS_UNIT_MEMBERSHIPS_API]: () => [],
};

const kyMock = {
  get: jest.fn((url) => ({
    json: () => {
      return Promise.resolve(queryMappings[url]());
    },
  })),
};

describe('usePurchaseOrderResources', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch order related data', async () => {
    const { result } = renderHook(() => usePurchaseOrderResources(orderStub.id, 'fiscal-year-id'), { wrapper });

    await waitFor(() => expect(result.current.isFiscalYearsFetched).toBeTruthy());
    await waitFor(() => expect(result.current.isOrderLoading).toBeFalsy());

    expect(result.current).toEqual(expect.objectContaining({
      order: orderStub,
    }));
  });
});
