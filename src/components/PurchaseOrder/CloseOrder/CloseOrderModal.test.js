import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import CloseOrderModal from './CloseOrderModal';

const defaultProps = {
  cancel: jest.fn(),
  isExporting: false,
  closeOrder: jest.fn(),
  orderNumber: '',
  closingReasons: [{
    id: 'id',
    reason: 'reason',
  }],
};

const renderCloseOrderModal = (props = {}) => render(
  <CloseOrderModal
    {...defaultProps}
    {...props}
  />,
);

describe('CloseOrderModal', () => {
  it('should render close order modal', () => {
    renderCloseOrderModal();

    expect(screen.getByText('ui-orders.closeOrderModal.title')).toBeDefined();
  });
});

describe('CloseOrderModal actions', () => {
  beforeEach(() => {
    defaultProps.cancel.mockClear();
    defaultProps.closeOrder.mockClear();
  });

  it('should cancel closing if cancel button was clicked', async () => {
    renderCloseOrderModal();

    const cancelBtn = await screen.findByText('ui-orders.closeOrderModal.cancel');

    user.click(cancelBtn);

    expect(defaultProps.cancel).toHaveBeenCalled();
  });

  it('should close order for some reason', async () => {
    renderCloseOrderModal();

    const closeBtn = await screen.findByText('ui-orders.closeOrderModal.submit');
    const select = await screen.findByLabelText('ui-orders.closeOrderModal.reason');
    const notes = await screen.findByLabelText('ui-orders.closeOrderModal.notes');

    user.selectOptions(select, 'reason');
    user.type(notes, 'some notes');
    user.click(closeBtn);

    expect(defaultProps.closeOrder).toHaveBeenCalled();
  });
});
