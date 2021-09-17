import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { order } from '../../test/jest/fixtures';
import { location } from '../../test/jest/routerMocks';

import OrdersListContainer from './OrdersListContainer';
import OrdersList from './OrdersList';
import { useOrders } from './hooks';

const defaultProps = {
  mutator: {
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

jest.mock('./OrdersList', () => jest.fn().mockReturnValue('OrdersList'));
jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useOrders: jest.fn().mockReturnValue({}),
}));

describe('OrdersListContainer', () => {
  beforeEach(() => {
    useOrders.mockClear();

    defaultProps.mutator.orderVendors.GET.mockClear();
    defaultProps.mutator.orderAcqUnits.GET.mockClear();
    defaultProps.mutator.orderUsers.GET.mockClear();
  });

  it('should render OrdersList', () => {
    renderOrdersListContainer();

    expect(screen.getByText('OrdersList')).toBeInTheDocument();
  });

  it('should pass useOrders result to OrdersList', () => {
    const records = [order];

    OrdersList.mockClear();
    useOrders.mockReturnValue({ orders: records });
    renderOrdersListContainer();

    expect(OrdersList.mock.calls[0][0].orders).toBe(records);
  });

  it('should load vendors, order acq ids and users when fetchReferences is called', async () => {
    renderOrdersListContainer();

    await act(() => useOrders.mock.calls[0][0].fetchReferences([order]));

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
  });
});
