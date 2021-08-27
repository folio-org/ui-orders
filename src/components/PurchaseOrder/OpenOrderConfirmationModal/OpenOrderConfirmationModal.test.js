import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import OpenOrderConfirmationModal from './OpenOrderConfirmationModal';

const defaultProps = {
  orderNumber: '42',
  cancel: jest.fn(),
  submit: jest.fn(),
};

const renderOpenOrderConfirmationModal = (props = {}) => render(
  <OpenOrderConfirmationModal
    {...defaultProps}
    {...props}
  />,
);

describe('OpenOrderConfirmationModal', () => {
  it('should render open order confirmation modal ', () => {
    renderOpenOrderConfirmationModal();

    expect(screen.getByText('ui-orders.openOrderModal.title')).toBeInTheDocument();
  });
});

describe('OpenOrderConfirmationModal actions', () => {
  beforeEach(() => {
    defaultProps.cancel.mockClear();
    defaultProps.submit.mockClear();
  });

  it('should close modal', async () => {
    renderOpenOrderConfirmationModal();

    const cancelBtn = await screen.findByText('ui-orders.openOrderModal.cancel');

    user.click(cancelBtn);

    expect(defaultProps.cancel).toHaveBeenCalled();
  });

  it('should handle submitting', async () => {
    renderOpenOrderConfirmationModal();

    const closeBtn = await screen.findByText('ui-orders.openOrderModal.submit');

    user.click(closeBtn);

    expect(defaultProps.submit).toHaveBeenCalled();
  });
});
