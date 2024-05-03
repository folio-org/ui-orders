import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import {
  useRoutingListById,
  useRoutingListMutation,
} from './hooks';
import { RoutingList } from './RoutingList';

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

  it('should render component when `useRoutingListById` hook `isLoading` is false', () => {
    renderComponent();

    expect(screen.getByText('ui-orders.routing.list.name')).toBeDefined();
  });

  it('should render Loading component when `useRoutingListById` hook `isLoading` is true', () => {
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

  it('should delete a routing list data', async () => {
    const mockDeleteListing = jest.fn();

    useRoutingListMutation.mockClear().mockReturnValue({
      deleteListing: mockDeleteListing,
    });
    useRoutingListById.mockClear().mockReturnValue({
      isLoading: false,
      routingList: mockRoutingList,
    });

    renderComponent();

    await user.click(screen.getByTestId('delete-routing-list'));
    await waitFor(() => screen.getByText('ui-orders.routing.list.delete.confirm'));

    const confirmDelete = await screen.findByText('ui-orders.routing.list.delete.confirm.label');

    expect(confirmDelete).toBeInTheDocument();
    await user.click(confirmDelete);

    expect(mockDeleteListing).toHaveBeenCalled();
  });
});
