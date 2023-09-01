import { MemoryRouter } from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

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
  it('should handle toggle action when export result button is clicked', async () => {
    renderOrdersListActionMenu();

    await user.click(screen.getAllByRole('button')[1]);

    expect(defaultProps.onToggle).toHaveBeenCalled();
    expect(defaultProps.toggleExportModal).toHaveBeenCalled();
  });
});
