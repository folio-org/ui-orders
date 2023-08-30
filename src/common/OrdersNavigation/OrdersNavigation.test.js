import { MemoryRouter } from 'react-router';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';

import OrdersNavigation from './OrdersNavigation';

const renderOrdersNavigation = (props = {}) => render(
  <OrdersNavigation
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('OrdersNavigation', () => {
  it('should render navigation for orders and order lines', () => {
    renderOrdersNavigation();

    expect(screen.getByText('ui-orders.navigation.orders')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.navigation.orderLines')).toBeInTheDocument();
  });
});

describe('OrdersNavigation actions', () => {
  it('should change style of buttons when another button is pressed', async () => {
    const { getByText, findAllByRole } = renderOrdersNavigation();
    const btns = await findAllByRole('button');

    await user.click(getByText('ui-orders.navigation.orderLines'));

    await waitFor(async () => expect(btns[0].classList[1]).toBe('default'));

    await user.click(getByText('ui-orders.navigation.orders'));

    await waitFor(async () => expect(btns[0].classList[1]).toBe('primary'));
  });
});
