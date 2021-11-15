import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { DeleteAcqMethodModal } from './DeleteAcqMethodModal';

const defaultProps = {
  nameToDelete: 'Test Acq Method',
  open: true,
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
  canBeDeleted: true,
};

const renderDeleteAcqMethodModal = (props = {}) => render(
  <DeleteAcqMethodModal
    {...defaultProps}
    {...props}
  />,
);

describe('DeleteAcqMethodModal', () => {
  it('should display modal to confirm deletion', () => {
    renderDeleteAcqMethodModal();

    expect(screen.getByText('stripes-smart-components.cv.termWillBeDeleted'));
  });

  it('should call \'onCancel\' when cancel btn was clicked', async () => {
    renderDeleteAcqMethodModal();

    const cancelBtn = await screen.findByText('stripes-core.button.cancel');

    user.click(cancelBtn);
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should call \'onConfirm\' when delete btn was clicked and acq method can be deleted', async () => {
    renderDeleteAcqMethodModal();

    const deleteBtn = await screen.findByText('stripes-core.button.delete');

    user.click(deleteBtn);
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('should restrict deletion if acq method cannot to be deleted', () => {
    renderDeleteAcqMethodModal({ canBeDeleted: false });

    expect(screen.getByText('ui-orders.settings.acquisitionMethods.remove.inUse')).toBeInTheDocument();
  });
});
