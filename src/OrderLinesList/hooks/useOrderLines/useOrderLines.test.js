import { renderHook } from '@testing-library/react-hooks';
import { useLocation } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { getLinesQuery } from '@folio/plugin-find-po-line';

import { orderLine } from '../../../../test/jest/fixtures';

import { useOrderLines } from './useOrderLines';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn(),
}));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: () => ['namespace'],
  useOkapiKy: jest.fn(),
}));
jest.mock('@folio/plugin-find-po-line/FindPOLine/utils', () => ({
  getLinesQuery: jest.fn(),
}));

const orderLines = [orderLine];
const queryMock = '(cql.allRecords=1) sortby metadata.updatedDate/sort.descending';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useOrderLines', () => {
  beforeEach(() => {
    getLinesQuery.mockReturnValue(() => Promise.resolve(queryMock));

    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({
            poLines: orderLines,
            totalRecords: orderLines.length,
          }),
        }),
      });
  });

  it('should return an empty list if there no filters were passed in the query', async () => {
    useLocation
      .mockClear()
      .mockReturnValue({ search: '' });

    const { result, waitFor } = renderHook(() => useOrderLines({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
    }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current).toEqual({
      orderLines: [],
      orderLinesCount: 0,
      isLoading: false,
      query: queryMock,
    });
  });

  it('should call fetchReferences to load lines related data', async () => {
    useLocation
      .mockClear()
      .mockReturnValue({ search: 'workflowStatus=Open' });

    const fetchReferences = jest.fn().mockReturnValue(Promise.resolve({}));
    const { result, waitFor } = renderHook(() => useOrderLines({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
      fetchReferences,
    }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(fetchReferences).toHaveBeenCalled();
  });

  it('should return fetched hydreated orders list', async () => {
    useLocation
      .mockClear()
      .mockReturnValue({ search: 'workflowStatus=Open&workflowStatus=Pending' });

    const fetchReferences = jest.fn().mockReturnValue(Promise.resolve({
      ordersMap: { [orderLine.purchaseOrderId]: { workflowStatus: 'Open' } },
    }));
    const { result, waitFor } = renderHook(() => useOrderLines({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
      fetchReferences,
    }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current).toEqual({
      orderLines: [{ ...orderLine, orderWorkflow: 'Open' }],
      orderLinesCount: 1,
      isLoading: false,
      query: queryMock,
    });
  });
});
