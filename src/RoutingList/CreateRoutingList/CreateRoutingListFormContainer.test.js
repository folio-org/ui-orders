import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import { useShowCallout } from '@folio/stripes-acq-components';

import { UNIQUE_NAME_ERROR_CODE } from '../constants';
import { useRoutingListMutation } from '../hooks';
import { CreateRoutingListFormContainer } from './CreateRoutingListFormContainer';

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

const mockCreateMocking = jest.fn();

jest.mock('../hooks', () => ({
  useRoutingListMutation: jest.fn(),
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderComponent = () => render(
  <CreateRoutingListFormContainer />,
  { wrapper },
);

describe('CreateRoutingListFormContainer', () => {
  const showCalloutMock = jest.fn();

  beforeEach(() => {
    useRoutingListMutation.mockClear().mockReturnValue({
      createListing: mockCreateMocking,
      isCreating: false,
    });
    showCalloutMock.mockClear();
    useShowCallout.mockClear().mockReturnValue(showCalloutMock);
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('ui-orders.routing.list.name')).toBeDefined();
  });

  it('should update routing list name', async () => {
    renderComponent();

    const nameInput = screen.getByRole('textbox', { name: 'ui-orders.routing.list.name' });

    await user.type(nameInput, 'test');

    const saveBtn = screen.getByRole('button', { name: 'ui-orders.routing.list.create.paneMenu.save' });

    expect(saveBtn).toBeEnabled();

    await user.click(saveBtn);

    expect(mockCreateMocking).toHaveBeenCalled();
  });

  it('should return error message when create routing list failed', async () => {
    let createListingOptions = {};
    const createListing = jest.fn().mockImplementation((_, options) => {
      createListingOptions = options;
    });

    useRoutingListMutation.mockClear().mockReturnValue({
      createListing,
    });

    renderComponent();

    const nameInput = screen.getByRole('textbox', { name: 'ui-orders.routing.list.name' });

    await user.type(nameInput, 'test 2');

    const saveBtn = screen.getByRole('button', { name: 'ui-orders.routing.list.create.paneMenu.save' });

    expect(saveBtn).toBeEnabled();

    await user.click(saveBtn);

    createListingOptions.onError({
      response: {
        json: jest.fn().mockResolvedValue({
          errors: [{ code: UNIQUE_NAME_ERROR_CODE }],
        }),
      },
    });

    expect(createListing).toHaveBeenCalled();
  });
});
