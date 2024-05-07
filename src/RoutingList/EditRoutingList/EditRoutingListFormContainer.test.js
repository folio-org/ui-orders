import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import { useShowCallout } from '@folio/stripes-acq-components';

import { UNIQUE_NAME_ERROR_CODE } from '../constants';
import {
  useRoutingList,
  useRoutingListMutation,
} from '../hooks';
import { EditRoutingListFormContainer } from './EditRoutingListFormContainer';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingView: jest.fn(() => 'Loading'),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
  useUsersBatch: jest.fn().mockReturnValue({
    users: [{ id: '1', personal: { firstName: 'firstName', lastName: 'lastName' } }],
    isLoading: false,
  }),
}));

const mockUpdateListing = jest.fn();
const mockDeleteListing = jest.fn();

jest.mock('../hooks', () => ({
  useRoutingList: jest.fn().mockReturnValue({
    routingList: {},
    isLoading: false,
  }),
  useRoutingListMutation: jest.fn(),
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderComponent = () => render(
  <EditRoutingListFormContainer />,
  { wrapper },
);

describe('EditRoutingListFormContainer', () => {
  const showCalloutMock = jest.fn();

  beforeEach(() => {
    useRoutingList.mockClear().mockReturnValue({
      routingList: {
        id: '1',
        name: 'test',
        userIds: ['1'],
      },
      isLoading: false,
    });
    useRoutingListMutation.mockClear().mockReturnValue({
      deleteListing: mockDeleteListing,
      updateListing: mockUpdateListing,
      isDeleting: false,
      isUpdating: false,
    });
    showCalloutMock.mockClear();
    useShowCallout.mockClear().mockReturnValue(showCalloutMock);
  });

  it('should render component when `useRoutingList` hook `isLoading` is false', () => {
    renderComponent();

    expect(screen.getByText('ui-orders.routing.list.name')).toBeDefined();
  });

  it('should render Loading component when `useRoutingList` hook `isLoading` is true', () => {
    useRoutingList.mockClear().mockReturnValue({ isLoading: true, routingList: {} });

    renderComponent();

    expect(screen.getByText('Loading')).toBeDefined();
  });

  it('should update routing list name', async () => {
    renderComponent();

    const nameInput = screen.getByRole('textbox', { name: 'ui-orders.routing.list.name' });

    await user.type(nameInput, 'edit');

    const saveBtn = screen.getByRole('button', { name: 'ui-orders.routing.list.create.paneMenu.save' });

    expect(saveBtn).toBeEnabled();

    await user.click(saveBtn);

    expect(mockUpdateListing).toHaveBeenCalled();
  });

  it('should return error message when create routing list failed', async () => {
    let updateListingOptions = {};
    const updateListing = jest.fn().mockImplementation((_, options) => {
      updateListingOptions = options;
    });

    useRoutingListMutation.mockClear().mockReturnValue({
      updateListing,
    });

    useRoutingList.mockClear().mockReturnValue({
      routingList: {},
      isLoading: false,
    });

    renderComponent();

    const nameInput = screen.getByRole('textbox', { name: 'ui-orders.routing.list.name' });

    await user.type(nameInput, 'test 2');

    const saveBtn = screen.getByRole('button', { name: 'ui-orders.routing.list.create.paneMenu.save' });

    expect(saveBtn).toBeEnabled();

    await user.click(saveBtn);

    updateListingOptions.onError({
      response: {
        json: jest.fn().mockResolvedValue({
          errors: [{ code: UNIQUE_NAME_ERROR_CODE }],
        }),
      },
    });

    expect(updateListing).toHaveBeenCalled();
  });
});
