import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { useRoutingListById } from './hooks';
import { RoutingListContainer } from './RoutingListContainer';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingView: jest.fn(() => 'Loading'),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useUsersBatch: jest.fn().mockReturnValue({
    users: [{ id: '1', personal: { firstName: 'firstName', lastName: 'lastName' } }],
    isLoading: false,
  }),
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

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderComponent = () => (render(
  <RoutingListContainer />,
  { wrapper },
));

describe('RoutingListContainer', () => {
  beforeEach(() => {
    useRoutingListById.mockClear().mockReturnValue({
      routingList: {},
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
});
