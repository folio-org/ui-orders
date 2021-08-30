import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import {
  useList,
} from '@folio/stripes-acq-components';

import { order } from '../../test/jest/fixtures';
import { location } from '../../test/jest/routerMocks';

import OrdersListContainer from './OrdersListContainer';
import OrdersList from './OrdersList';

const defaultProps = {
  mutator: {
    ordersListRecords: {
      GET: jest.fn(),
    },
    orderVendors: {
      GET: jest.fn().mockResolvedValue([{ id: 'vendorId' }]),
    },
    orderAcqUnits: {
      GET: jest.fn().mockResolvedValue([{ id: 'unitId' }]),
    },
    orderUsers: {
      GET: jest.fn().mockResolvedValue([{ id: 'userId' }]),
    },
  },
  location,
};

const renderOrdersListContainer = (props = {}) => render(
  <OrdersListContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

const mockLocalStorageFilters = {
  filters: {},
  searchQuery: '',
  applyFilters: jest.fn(),
  applySearch: jest.fn(),
  changeSearch: jest.fn(),
  resetFilters: jest.fn(),
  changeIndex: jest.fn(),
  searchIndex: '',
};

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useLocalStorageFilters: jest.fn(() => Object.values(mockLocalStorageFilters)),
  useFiltersToogle: jest.fn().mockReturnValue({ isFiltersOpened: true, toggleFilters: jest.fn() }),
  useList: jest.fn().mockReturnValue({}),
}));
jest.mock('./OrdersList', () => jest.fn().mockReturnValue('OrdersList'));

describe('OrdersListContainer', () => {
  beforeEach(() => {
    useList.mockClear();
    defaultProps.mutator.ordersListRecords.GET.mockClear();
    defaultProps.mutator.orderVendors.GET.mockClear();
    defaultProps.mutator.orderAcqUnits.GET.mockClear();
    defaultProps.mutator.orderUsers.GET.mockClear();
  });

  it('should render OrdersList', () => {
    renderOrdersListContainer();

    expect(screen.getByText('OrdersList')).toBeInTheDocument();
  });

  it('should pass useList result to OrdersList', () => {
    const records = [order];

    OrdersList.mockClear();
    useList.mockReturnValue({ records });
    renderOrdersListContainer();

    expect(OrdersList.mock.calls[0][0].orders).toBe(records);
  });

  it('should load orders in useList', async () => {
    const OFFSET = 0;

    renderOrdersListContainer();

    await act(() => useList.mock.calls[0][1](OFFSET));

    expect(defaultProps.mutator.ordersListRecords.GET).toHaveBeenCalledWith({
      params: {
        limit: 30,
        offset: OFFSET,
        query: '(cql.allRecords=1) sortby metadata.updatedDate/sort.descending',
      },
    });
  });

  it('should load vendors, order acq ids and users if exist in useList', async () => {
    const ordersResponse = { purchaseOrders: [order], totalRecords: 1 };
    const setOrders = jest.fn();

    renderOrdersListContainer();

    await act(() => useList.mock.calls[0][2](setOrders, ordersResponse));

    expect(defaultProps.mutator.orderVendors.GET).toHaveBeenCalledWith({
      params: {
        limit: 1000,
        query: `id==${order.vendor}`,
      },
    });

    expect(defaultProps.mutator.orderAcqUnits.GET).toHaveBeenCalledWith({
      params: {
        limit: 1000,
        query: `id==${order.acqUnitIds[0]}`,
      },
    });

    expect(defaultProps.mutator.orderUsers.GET).toHaveBeenCalledWith({
      params: {
        limit: 1000,
        query: `id==${order.assignedTo}`,
      },
    });

    expect(setOrders).toHaveBeenCalled();
  });
});
