import user from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { act, render, screen } from '@testing-library/react';

import { BreakInstanceConnectionModal } from './BreakInstanceConnectionModal';

const defaultProps = {
  title: 'Test title',
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
};

const renderBreakInstanceConnectionModal = (props = {}) => render(
  <BreakInstanceConnectionModal
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('BreakInstanceConnectionModal', () => {
  it('should render break instance connection confirmation modal', () => {
    renderBreakInstanceConnectionModal();

    expect(screen.getByText('ui-orders.breakInstanceConnection.modal.heading')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.breakInstanceConnection.modal.message')).toBeInTheDocument();
  });

  it('should call \'onConfirm\' when confirm button was clicked', async () => {
    renderBreakInstanceConnectionModal();

    await act(async () => user.click(screen.getByRole('button', { name: 'ui-orders.button.confirm' })));

    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('should call \'onCancel\' when cancel button was clicked', async () => {
    renderBreakInstanceConnectionModal();

    await act(async () => user.click(screen.getByRole('button', { name: 'stripes-components.cancel' })));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});
