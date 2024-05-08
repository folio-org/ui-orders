import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import {
  useGoBack,
  useRoutingList,
  useRoutingListMutation,
} from '../hooks';
import { RoutingListView } from './RoutingListView';

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

jest.mock('../hooks', () => ({
  useGoBack: jest.fn().mockReturnValue(jest.fn()),
  useRoutingList: jest.fn().mockReturnValue({
    routingList: {},
    isLoading: false,
  }),
  useRoutingListMutation: jest.fn().mockReturnValue({
    createRoutingList: jest.fn(),
    deleteRoutingList: jest.fn(),
    updateRoutingList: jest.fn(),
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
  <RoutingListView />,
  { wrapper },
));

const mockRoutingList = {
  id: '1',
  notes: 'notes',
  poLineId: '1',
  name: 'name',
  userIds: ['1', '2'],
};

describe('RoutingListView', () => {
  beforeEach(() => {
    useRoutingList.mockClear().mockReturnValue({
      routingList: mockRoutingList,
      isLoading: false,
    });
  });

  it('should render component when `useRoutingListById` hook `isLoading` is false', () => {
    renderComponent();

    expect(screen.getByText('ui-orders.routing.list.name')).toBeDefined();
  });

  it('should render Loading when `useRoutingList` hook is `isLoading`', () => {
    useRoutingList.mockClear().mockReturnValue({ isLoading: true, routingList: {} });

    renderComponent();

    expect(screen.getByText('Loading')).toBeDefined();
  });

  it('should render routingList data', () => {
    useRoutingList.mockClear().mockReturnValue({
      isLoading: false,
      routingList: mockRoutingList,
    });

    renderComponent();

    expect(screen.getByText('ui-orders.routing.list.users')).toBeDefined();
  });

  it('should delete a routing list data', async () => {
    const mockDeleteListing = jest.fn();

    useRoutingListMutation.mockClear().mockReturnValue({
      deleteRoutingList: mockDeleteListing,
    });
    useRoutingList.mockClear().mockReturnValue({
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

  it('should call `useGoBack` when click close icon', async () => {
    const mockGoBack = jest.fn();

    useRoutingList.mockClear().mockReturnValue({
      isLoading: false,
      routingList: mockRoutingList,
    });

    useGoBack.mockClear().mockReturnValue(mockGoBack);

    renderComponent();

    screen.debug(undefined, 400000);

    await user.click(screen.getByLabelText('stripes-components.closeItem'));

    expect(mockGoBack).toHaveBeenCalled();
  });
});
