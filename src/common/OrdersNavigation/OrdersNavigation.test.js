import React from 'react';
import user from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

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

    user.click(getByText('ui-orders.navigation.orderLines'));

    waitFor(async () => expect(btns[0].classList[1]).toBe('default'));

    user.click(getByText('ui-orders.navigation.orders'));

    waitFor(async () => expect(btns[0].classList[1]).toBe('primary'));
  });
});
