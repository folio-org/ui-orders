import { MemoryRouter } from 'react-router';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { history } from 'fixtures/routerMocks';
import OrdersNavigation from './OrdersNavigation';


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  withRouter: (Component) => (props) => <Component {...props} />,
}));

const renderOrdersNavigation = (props = {}) => render(
  <OrdersNavigation
    history={history}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('OrdersNavigation', () => {
  beforeEach(() => {
    history.push.mockClear();
  });

  it('should render navigation for orders and order lines', () => {
    renderOrdersNavigation();

    expect(screen.getByText('ui-orders.navigation.orders')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.navigation.orderLines')).toBeInTheDocument();
  });

  it('should display \'Orders\' toggle as active', async () => {
    renderOrdersNavigation({ isOrders: true });

    const ordersBtn = await screen.findByRole('button', { name: 'ui-orders.navigation.orders' });
    const orderLinesBtn = await screen.findByRole('button', { name: 'ui-orders.navigation.orderLines' });

    expect(ordersBtn.classList[1]).toBe('primary');
    expect(orderLinesBtn.classList[1]).toBe('default');
  });

  it('should display \'Orders\' toggle as active', async () => {
    renderOrdersNavigation({ isOrderLines: true });

    const ordersBtn = await screen.findByRole('button', { name: 'ui-orders.navigation.orders' });
    const orderLinesBtn = await screen.findByRole('button', { name: 'ui-orders.navigation.orderLines' });

    expect(ordersBtn.classList[1]).toBe('default');
    expect(orderLinesBtn.classList[1]).toBe('primary');
  });
});

describe('OrdersNavigation actions', () => {
  it('should switch between toggles', async () => {
    renderOrdersNavigation();

    await user.click(screen.getByText('ui-orders.navigation.orders'));
    await user.click(screen.getByText('ui-orders.navigation.orderLines'));

    expect(history.push).toHaveBeenCalledTimes(2);
  });
});
