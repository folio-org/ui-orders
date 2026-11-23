import { FormattedMessage } from 'react-intl';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { BaseOpenOrderModal } from './BaseOpenOrderModal';

const WARNING = 'ui-orders.openOrderModal.deprecatedAcquisitionMethods';

const defaultProps = {
  deprecatedAcqMethods: [],
  onCancel: jest.fn(),
  onSubmit: jest.fn(),
  orderNumber: '10003',
};

const renderBaseOpenOrderModal = (props = {}) => render(
  <BaseOpenOrderModal
    {...defaultProps}
    {...props}
  />,
);

describe('BaseOpenOrderModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should ask to open the order without a warning when no deprecated methods are used', () => {
    renderBaseOpenOrderModal();

    expect(screen.getByText('ui-orders.openOrderModal.title')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.openOrderModal.message')).toBeInTheDocument();
    expect(screen.queryByText(WARNING)).not.toBeInTheDocument();
  });

  it('should list the deprecated methods with the lines that use them', () => {
    renderBaseOpenOrderModal({
      deprecatedAcqMethods: [
        { id: 'old', value: 'Old method', deprecated: true, poLineNumbers: ['POL-1', 'POL-2'] },
        { id: 'other', value: 'Other method', deprecated: true, poLineNumbers: [] },
      ],
    });

    expect(screen.getByText(WARNING)).toBeInTheDocument();
    expect(FormattedMessage.mock.calls.find(([{ id }]) => id === WARNING)[0].values).toEqual({
      count: 2,
      methods: 'Old method (POL-1, POL-2), Other method',
    });
  });

  it('should disable submit while loading', () => {
    renderBaseOpenOrderModal({ isLoading: true });

    expect(screen.getByText('ui-orders.openOrderModal.submit').closest('button')).toBeDisabled();
  });

  it('should cancel', async () => {
    renderBaseOpenOrderModal();

    await user.click(screen.getByText('ui-orders.openOrderModal.cancel'));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should submit', async () => {
    renderBaseOpenOrderModal();

    await user.click(screen.getByText('ui-orders.openOrderModal.submit'));

    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
});
