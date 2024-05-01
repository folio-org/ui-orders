import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import { useUsersBatch } from '@folio/stripes-acq-components';

import { RoutingListUsers } from './RoutingListUsers';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn(() => 'Loading'),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useUsersBatch: jest.fn().mockReturnValue({
    users: [{ id: '1', personal: { firstName: 'firstName', lastName: 'lastName' } }],
    isLoading: false,
  }),
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderComponent = (props = {}) => (render(
  <RoutingListUsers
    canEdit
    onAddUsers={() => {}}
    userIds={['1']}
    {...props}
  />,
  { wrapper },
));

describe('RoutingListUsers', () => {
  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('ui-orders.routing.list.addUsers')).toBeDefined();
  });

  it('should render Loading', () => {
    useUsersBatch.mockClear().mockReturnValue({ isLoading: true, users: [] });

    renderComponent();

    expect(screen.getByText('Loading')).toBeDefined();
  });

  it('should delete the user on click `x` icon', async () => {
    const mockOnAddUsers = jest.fn();

    useUsersBatch.mockClear().mockReturnValue({
      isLoading: false,
      users: [{ id: '1', personal: { firstName: 'firstName', lastName: 'lastName' } }],
    });

    const { container } = renderComponent({ onAddUsers: mockOnAddUsers });

    await user.click(container.querySelector('#clickable-remove-user-1'));

    expect(mockOnAddUsers).toHaveBeenCalled();
  });

  it('should not render add users button if canEdit is false', () => {
    renderComponent({ canEdit: false });

    expect(screen.queryByText('ui-orders.routing.list.addUsers')).toBeNull();
  });
});
