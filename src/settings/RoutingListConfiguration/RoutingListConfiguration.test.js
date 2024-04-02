import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import { LIST_CONFIGURATION_BASE_PATH } from './constants';
import { useListConfiguration, useListConfigurationMutation } from './hooks';
import RoutingListConfiguration from './RoutingListConfiguration';

jest.mock('./hooks', () => ({
  useListConfiguration: jest.fn(() => ({
    listConfig: {},
    refetch: jest.fn(),
  })),
  useListConfigurationMutation: jest.fn(() => ({
    createListConfig: jest.fn(),
    updateListConfig: jest.fn(),
  })),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter
      initialEntries={[{
        pathname: LIST_CONFIGURATION_BASE_PATH,
      }]}
    >
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

const createListConfigMock = jest.fn();
const updateListConfigMock = jest.fn();

const renderComponent = () => render(
  <RoutingListConfiguration />,
  { wrapper },
);

describe('RoutingListConfiguration', () => {
  beforeEach(() => {
    useListConfiguration.mockClear().mockReturnValue({
      listConfig: {
        id: 'id',
        localizedTemplates: {
          en: {
            body: 'email body',
          },
        },
      },
      refetch: jest.fn(),
    });
    useListConfigurationMutation.mockClear().mockReturnValue({
      createListConfig: createListConfigMock,
      updateListConfig: updateListConfigMock,
    });
  });

  it('should display routing list configuration pane', async () => {
    renderComponent();

    const listConfigurationTitle = await screen.findByText('ui-orders.settings.routing.listConfiguration');

    expect(listConfigurationTitle).toBeInTheDocument();
  });

  it('should display email preview content', async () => {
    renderComponent();

    const previewButton = await screen.findByText('ui-orders.settings.routing.listConfiguration.preview.button');

    expect(previewButton).toBeInTheDocument();

    await user.click(previewButton);

    const emailBody = await screen.findByText('ui-orders.settings.routing.listConfiguration.previewHeader');

    expect(emailBody).toBeInTheDocument();
  });

  it('should create template configs data on click save button', async () => {
    useListConfiguration.mockClear().mockReturnValue({
      listConfig: {},
      refetch: jest.fn(),
    });

    renderComponent();

    const editBtn = await screen.findByRole('button', { name: 'stripes-core.button.edit' });

    await user.click(editBtn);

    const descriptionInput = await screen.findByTestId('routingListConfigurationDescription');

    await user.type(descriptionInput, 'edited');

    const saveBtn = await screen.findByText('stripes-core.button.save');

    expect(saveBtn).toBeEnabled();

    await user.click(saveBtn);

    expect(createListConfigMock).toHaveBeenCalled();
  });

  it('should display edit page and update description', async () => {
    renderComponent();

    const editBtn = await screen.findByRole('button', { name: 'stripes-core.button.edit' });

    await user.click(editBtn);

    const saveBtn = await screen.findByText('stripes-core.button.save');

    expect(saveBtn).toBeInTheDocument();
    const descriptionInput = screen.getByTestId('routingListConfigurationDescription');

    await user.type(descriptionInput, 'edited');

    expect(saveBtn).toBeEnabled();

    await user.click(saveBtn);

    expect(updateListConfigMock).toHaveBeenCalled();
  });

  it('should close edit list configuration pane on button is clicked', async () => {
    renderComponent();

    const editBtn = await screen.findByRole('button', { name: 'stripes-core.button.edit' });

    await user.click(editBtn);

    const cancelBtn = await screen.findByText('stripes-core.button.cancel');

    await user.click(cancelBtn);

    expect(updateListConfigMock).toHaveBeenCalled();
  });
});
