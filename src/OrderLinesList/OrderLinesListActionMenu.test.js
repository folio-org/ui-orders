import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import OrderLinesListActionMenu from './OrderLinesListActionMenu';

const defaultProps = {
  orderLinesCount: 1,
  onToggle: jest.fn(),
  toggleExportModal: jest.fn(),
};

const renderOrderLinesListActionMenu = (props = {}) => render(
  <OrderLinesListActionMenu
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('OrderLinesListActionMenu', () => {
  it('should handle toggle action when export result button is clicked', () => {
    renderOrderLinesListActionMenu();

    user.click(screen.getAllByRole('button')[0]);

    expect(defaultProps.onToggle).toHaveBeenCalled();
    expect(defaultProps.toggleExportModal).toHaveBeenCalled();
  });
});
