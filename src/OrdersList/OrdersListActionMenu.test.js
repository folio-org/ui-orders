import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import OrdersListActionMenu from './OrdersListActionMenu';

const defaultProps = {
  ordersCount: 10,
  search: '',
  onToggle: jest.fn(),
  toggleExportModal: jest.fn(),
};

const renderOrdersListActionMenu = (props = {}) => render(
  <OrdersListActionMenu
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('OrdersListActionMenu', () => {
  it('should handle toggle action when export result button is clicked', () => {
    renderOrdersListActionMenu();

    user.click(screen.getAllByRole('button')[1]);

    expect(defaultProps.onToggle).toHaveBeenCalled();
    expect(defaultProps.toggleExportModal).toHaveBeenCalled();
  });
});
