import { renderHook } from '@testing-library/react-hooks';
import { useLocation } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useBuildQuery } from '../useBuildQuery';
import { useOrders } from './useOrders';
import { order } from '../../../../test/jest/fixtures';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn(),
}));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: () => ['namespace'],
  useOkapiKy: jest.fn(),
  useStripes: () => ({ timezone: 'UTC' }),
}));
jest.mock('../useBuildQuery', () => ({ useBuildQuery: jest.fn() }));

const orders = [order];
const queryMock = '(cql.allRecords=1) sortby metadata.updatedDate/sort.descending';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useOrders', () => {
  beforeEach(() => {
    useBuildQuery.mockReturnValue(jest.fn(() => queryMock));

    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({
            purchaseOrders: orders,
            totalRecords: orders.length,
          }),
        }),
      });
  });

  it('should return an empty list if there no filters were passed in the query', async () => {
    useLocation
      .mockClear()
      .mockReturnValue({ search: '' });

    const { result, waitFor } = renderHook(() => useOrders({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
    }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current).toEqual({
      orders: [],
      ordersCount: 0,
      isLoading: false,
      query: queryMock,
    });
  });

  it('should call fetchReferences to load order related data', async () => {
    useLocation
      .mockClear()
      .mockReturnValue({ search: 'workflowStatus=Open&workflowStatus=Pending' });

    const fetchReferences = jest.fn().mockReturnValue(Promise.resolve({}));
    const { result, waitFor } = renderHook(() => useOrders({
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
      vendorsMap: { [order.vendor]: { code: 'vendorCode' } },
      usersMap: { [order.assignedTo]: { personal: { lastName: 'testUser' } } },
      acqUnitsMap: { [order.acqUnitIds[0]]: { name: 'Main' } },
    }));
    const { result, waitFor } = renderHook(() => useOrders({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
      fetchReferences,
    }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current).toEqual({
      orders: [{ ...order, vendorCode: 'vendorCode', acquisitionsUnit: 'Main', assignedTo: 'testUser  ' }],
      ordersCount: 1,
      isLoading: false,
      query: queryMock,
    });
  });
});
