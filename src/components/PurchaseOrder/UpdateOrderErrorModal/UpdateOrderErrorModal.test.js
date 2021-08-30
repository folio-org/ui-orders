import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import UpdateOrderErrorModal from './UpdateOrderErrorModal';

const defaultProps = {
  cancel: jest.fn(),
  errors: [{
    code: 'code',
    poLineNumber: 'poLineNumber',
  }],
};

const renderUpdateOrderErrorModal = (props = {}) => render(
  <UpdateOrderErrorModal
    {...defaultProps}
    {...props}
  />,
);

describe('UpdateOrderErrorModal', () => {
  it('should render open order confirmation modal ', () => {
    renderUpdateOrderErrorModal();

    expect(screen.getByText('ui-orders.openOrderModal.title')).toBeInTheDocument();
  });
});

describe('UpdateOrderErrorModal actions', () => {
  beforeEach(() => {
    defaultProps.cancel.mockClear();
  });

  it('should close modal', async () => {
    renderUpdateOrderErrorModal();

    const cancelBtn = await screen.findByText('ui-orders.openOrderModal.cancel');

    user.click(cancelBtn);

    expect(defaultProps.cancel).toHaveBeenCalled();
  });
});
