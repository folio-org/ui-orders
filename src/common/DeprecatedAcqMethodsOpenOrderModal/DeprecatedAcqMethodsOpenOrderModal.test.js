import { FormattedMessage } from 'react-intl';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { DeprecatedAcqMethodsOpenOrderModal } from './DeprecatedAcqMethodsOpenOrderModal';

const WARNING = 'ui-orders.openOrderModal.deprecatedAcquisitionMethods';

const defaultProps = {
  deprecatedAcqMethods: [],
  onCancel: jest.fn(),
  onSubmit: jest.fn(),
  orderNumber: '10003',
};

const renderDeprecatedAcqMethodsOpenOrderModal = (props = {}) => render(
  <DeprecatedAcqMethodsOpenOrderModal
    {...defaultProps}
    {...props}
  />,
);

describe('DeprecatedAcqMethodsOpenOrderModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should ask to open the order without a warning when no deprecated methods are used', () => {
    renderDeprecatedAcqMethodsOpenOrderModal();

    expect(screen.queryByText(WARNING)).not.toBeInTheDocument();
  });

  it('should list the deprecated methods with the lines that use them', () => {
    renderDeprecatedAcqMethodsOpenOrderModal({
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

  it('should pass the actions to the open order modal', async () => {
    renderDeprecatedAcqMethodsOpenOrderModal();

    await user.click(screen.getByText('ui-orders.openOrderModal.submit'));

    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
});
