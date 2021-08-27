import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import LinesLimit from './LinesLimit';

const defaultProps = {
  cancel: jest.fn(),
  createOrder: jest.fn(),
};

const renderLinesLimit = (props = {}) => render(
  <LinesLimit
    {...defaultProps}
    {...props}
  />,
);

describe('CloseOrderModal', () => {
  it('should render lines limit modal ', () => {
    renderLinesLimit();

    expect(screen.getByText('ui-orders.linesLimit.label')).toBeDefined();
  });
});

describe('CloseOrderModal actions', () => {
  beforeEach(() => {
    defaultProps.cancel.mockClear();
    defaultProps.createOrder.mockClear();
  });

  it('should close modal', async () => {
    renderLinesLimit();

    const cancelBtn = await screen.findByText('ui-orders.linesLimit.okBtn');

    user.click(cancelBtn);

    expect(defaultProps.cancel).toHaveBeenCalled();
  });

  it('should handle \'createOrder\' action', async () => {
    renderLinesLimit();

    const closeBtn = await screen.findByText('ui-orders.linesLimit.createBtn');

    user.click(closeBtn);

    expect(defaultProps.createOrder).toHaveBeenCalled();
  });
});
