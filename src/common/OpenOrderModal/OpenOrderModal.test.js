import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { OpenOrderModal } from './OpenOrderModal';

const defaultProps = {
  onCancel: jest.fn(),
  onSubmit: jest.fn(),
  orderNumber: '10003',
};

const renderOpenOrderModal = (props = {}) => render(
  <OpenOrderModal
    {...defaultProps}
    {...props}
  />,
);

describe('OpenOrderModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should ask to open the order with the given content', () => {
    renderOpenOrderModal({ children: 'Additional content' });

    expect(screen.getByText('ui-orders.openOrderModal.title')).toBeInTheDocument();
    expect(screen.getByText('Additional content')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.openOrderModal.message')).toBeInTheDocument();
  });

  it('should disable submit while loading', () => {
    renderOpenOrderModal({ isLoading: true });

    expect(screen.getByText('ui-orders.openOrderModal.submit').closest('button')).toBeDisabled();
  });

  it('should cancel', async () => {
    renderOpenOrderModal();

    await user.click(screen.getByText('ui-orders.openOrderModal.cancel'));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should submit', async () => {
    renderOpenOrderModal();

    await user.click(screen.getByText('ui-orders.openOrderModal.submit'));

    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
});
