import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import { useShowCallout } from '@folio/stripes-acq-components';

import { UNIQUE_NAME_ERROR_CODE } from '../constants';
import { useRoutingListMutation } from '../hooks';
import { RoutingListCreate } from './RoutingListCreate';

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
  useGoBack: jest.fn(),
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderComponent = () => render(
  <RoutingListCreate />,
  { wrapper },
);

describe('RoutingListCreate', () => {
  const showCalloutMock = jest.fn();

  beforeEach(() => {
    useRoutingListMutation.mockClear().mockReturnValue({
      createRoutingList: mockCreateMocking,
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
    let createRoutingListOptions = {};
    const createRoutingList = jest.fn().mockImplementation((_, options) => {
      createRoutingListOptions = options;
    });

    useRoutingListMutation.mockClear().mockReturnValue({
      createRoutingList,
    });

    renderComponent();

    const nameInput = screen.getByRole('textbox', { name: 'ui-orders.routing.list.name' });

    await user.type(nameInput, 'test 2');

    const saveBtn = screen.getByRole('button', { name: 'ui-orders.routing.list.create.paneMenu.save' });

    expect(saveBtn).toBeEnabled();

    await user.click(saveBtn);

    createRoutingListOptions.onError({
      response: {
        json: jest.fn().mockResolvedValue({
          errors: [{ code: UNIQUE_NAME_ERROR_CODE }],
        }),
      },
    });

    expect(createRoutingList).toHaveBeenCalled();
  });
});
