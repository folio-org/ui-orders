import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { DeprecatedAcqMethodsModal } from './DeprecatedAcqMethodsModal';

const defaultProps = {
  deprecatedAcqMethods: [{ id: 'old', value: 'Old method', deprecated: true, poLineNumbers: ['POL-1'] }],
  isOpen: true,
  onCancel: jest.fn(),
  onConfirm: jest.fn(),
  orderNumber: '10003',
};

const renderDeprecatedAcqMethodsModal = (props = {}) => render(
  <DeprecatedAcqMethodsModal
    {...defaultProps}
    {...props}
  />,
);

describe('DeprecatedAcqMethodsModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should warn about the given deprecated methods', () => {
    renderDeprecatedAcqMethodsModal();

    expect(screen.getByText('ui-orders.openOrderModal.deprecatedAcquisitionMethods')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    renderDeprecatedAcqMethodsModal({ isOpen: false });

    expect(screen.queryByText('ui-orders.openOrderModal.title')).not.toBeInTheDocument();
  });

  it('should confirm', async () => {
    renderDeprecatedAcqMethodsModal();

    await user.click(screen.getByText('ui-orders.openOrderModal.submit'));

    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('should cancel', async () => {
    renderDeprecatedAcqMethodsModal();

    await user.click(screen.getByText('ui-orders.openOrderModal.cancel'));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});
