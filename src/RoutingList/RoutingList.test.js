import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { useRoutingListById } from './hooks';
import { RoutingList } from './RoutingList';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingView: jest.fn(() => 'Loading'),
}));

jest.mock('./hooks', () => ({
  useRoutingListById: jest.fn().mockReturnValue({
    routingList: {},
    isLoading: false,
  }),
  useRoutingListMutation: jest.fn().mockReturnValue({
    createListing: jest.fn(),
    deleteListing: jest.fn(),
    updateListing: jest.fn(),
    isCreating: false,
    isDeleting: false,
    isUpdating: false,
  }),
}));

jest.mock('./RoutingListUsers', () => ({
  RoutingListUsers: jest.fn(() => 'RoutingListUsers'),
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderComponent = () => (render(
  <RoutingList />,
  { wrapper },
));

const mockRoutingList = {
  id: '1',
  notes: 'notes',
  poLineId: '1',
  name: 'name',
  userIds: ['firstName lastName'],
};

describe('RoutingList', () => {
  beforeEach(() => {
    useRoutingListById.mockClear().mockReturnValue({
      routingList: mockRoutingList,
      isLoading: false,
    });
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('ui-orders.routing.list.name')).toBeDefined();
  });

  it('should render Loading', () => {
    useRoutingListById.mockClear().mockReturnValue({ isLoading: true, routingList: {} });

    renderComponent();

    expect(screen.getByText('Loading')).toBeDefined();
  });

  it('should render routingList data', () => {
    useRoutingListById.mockClear().mockReturnValue({
      isLoading: false,
      routingList: mockRoutingList,
    });

    renderComponent();

    expect(screen.getByText('ui-orders.routing.list.users')).toBeDefined();
  });
});
