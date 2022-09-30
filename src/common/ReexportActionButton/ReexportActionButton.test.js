import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { ReexportActionButton } from './ReexportActionButton';

const defaultProps = {
  id: 'test-button',
  disabled: false,
  onClick: jest.fn(),
};

const renderReexportActionButton = (props = {}) => render(
  <ReexportActionButton
    {...defaultProps}
    {...props}
  />,
);

describe('ReexportActionButton', () => {
  beforeEach(() => {
    defaultProps.onClick.mockClear();
  });

  it('should render button for re-export action', () => {
    renderReexportActionButton();

    expect(screen.getByTestId(defaultProps.id)).toBeInTheDocument();
  });

  it('should call \'onClick\' handler when button was clicked', () => {
    renderReexportActionButton();

    user.click(screen.getByTestId(defaultProps.id));

    expect(defaultProps.onClick).toHaveBeenCalled();
  });
});
