import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import { useOkapiKy } from '@folio/stripes/core';
import { ORDERS_STORAGE_SETTINGS_API } from '@folio/stripes-acq-components';

import { useRoutingAddressSettings, useUserAddressTypes } from './hooks';
import { RoutingAddress } from './RoutingAddress';
import { useConfigurationSettingsMutation } from '../hooks';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingPane: () => <div>LoadingPane</div>,
}));

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useConfigurationSettingsMutation: jest.fn({
    createConfigSettings: jest.fn(),
    updateConfigSettings: jest.fn(),
  }),
}));
jest.mock('./hooks', () => ({
  useRoutingAddressSettings: jest.fn(),
  useUserAddressTypes: jest.fn(),
}));

const renderComponent = () => render(
  <RoutingAddress />,
  { wrapper: MemoryRouter },
);

const mockRefetch = jest.fn();
const mockUpdateConfigSettings = jest.fn();
const mockKy = {
  put: jest.fn((_url, { data }) => ({
    json() {
      return Promise.resolve(data);
    },
  })),
};

const mockAddressTypes = [
  {
    'addressType': 'Claim',
    'id': 'b6f4d1c6-0dfa-463c-9534-f49c4f0ae090',
  },
  {
    'addressType': 'Home',
    'id': '93d3d88d-499b-45d0-9bc7-ac73c3a19880',
  },
];
const mockData = {
  id: 'setting-id',
  value: mockAddressTypes[0].addressType,
};

describe('RoutingAddress', () => {
  beforeEach(() => {
    mockKy.put.mockClear();
    useConfigurationSettingsMutation
      .mockClear()
      .mockReturnValue({
        createConfigSettings: jest.fn(),
        updateConfigSettings: mockUpdateConfigSettings,
      });
    useUserAddressTypes.mockClear().mockReturnValue({
      addressTypes: mockAddressTypes,
      isLoading: false,
    });
    useRoutingAddressSettings
      .mockClear()
      .mockReturnValue({
        isFetching: false,
        refetch: mockRefetch,
        data: mockData,
      });
    useOkapiKy
      .mockClear()
      .mockReturnValue(mockKy);
  });

  it('should display pane headings', () => {
    renderComponent();

    const paneTitle = screen.getByText('ui-orders.settings.routing.address');
    const fieldLabel = screen.getByText('ui-orders.settings.addressTypes.select.label');

    expect(paneTitle).toBeInTheDocument();
    expect(fieldLabel).toBeInTheDocument();
  });

  it('should render "LoadingPane" component when settings are loading', () => {
    useRoutingAddressSettings.mockReturnValue({ isFetching: true });

    renderComponent();

    expect(screen.getByText('LoadingPane')).toBeInTheDocument();
  });

  it('should handle routing address settings submit', async () => {
    useRoutingAddressSettings
      .mockClear()
      .mockReturnValue({
        data: mockData,
        isFetching: false,
        refetch: mockRefetch,
      });

    renderComponent();

    await user.selectOptions(
      await screen.findByRole('combobox', { name: 'ui-orders.settings.addressTypes.select.label' }),
      [mockAddressTypes[1].addressType],
    );
    await user.click(await screen.findByRole('button', { name: 'stripes-core.button.save' }));

    expect(mockUpdateConfigSettings).toHaveBeenCalledWith(expect.objectContaining({
      value: mockAddressTypes[1].addressType,
    }));
  });
});
