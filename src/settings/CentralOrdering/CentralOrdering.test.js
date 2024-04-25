import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import { CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH } from '../../common/constants';
import { useConfigurationSettingsMutation, useDefaultReceivingSearchSettings } from '../hooks';
import { CentralOrdering } from './CentralOrdering';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingPane: () => <div>LoadingPane</div>,
}));

jest.mock('../hooks', () => ({
  useDefaultReceivingSearchSettings: jest.fn(),
  useConfigurationSettingsMutation: jest.fn(),
}));

const renderCentralOrderingSettings = () => render(
  <CentralOrdering />,
  { wrapper: MemoryRouter },
);

const mockRefetch = jest.fn();
const mockUpdateConfigSettings = jest.fn();
const mockData = {
  id: 'setting-id',
  value: CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.centralOnly,
};

describe('CentralOrdering component', () => {
  beforeEach(() => {
    useConfigurationSettingsMutation
      .mockClear()
      .mockReturnValue({
        createConfigSettings: jest.fn(),
        updateConfigSettings: mockUpdateConfigSettings,
      });
    useDefaultReceivingSearchSettings
      .mockClear()
      .mockReturnValue({
        isFetching: false,
        refetch: mockRefetch,
      });
  });

  it('should display pane headings', () => {
    renderCentralOrderingSettings();

    const paneTitle = screen.getByText('ui-orders.settings.centralOrdering.label');
    const fieldLabel = screen.getByText('ui-orders.settings.centralOrdering.receivingSearch.label');

    expect(paneTitle).toBeInTheDocument();
    expect(fieldLabel).toBeInTheDocument();
  });

  it('should render "LoadingPane" component when settings are loading', () => {
    useDefaultReceivingSearchSettings.mockReturnValue({ isFetching: true });

    renderCentralOrderingSettings();

    expect(screen.getByText('LoadingPane')).toBeInTheDocument();
  });

  it('should handle central ordering settings submit', async () => {
    useDefaultReceivingSearchSettings
      .mockClear()
      .mockReturnValue({
        data: mockData,
        isFetching: false,
        refetch: mockRefetch,
      });

    renderCentralOrderingSettings();

    await user.selectOptions(
      await screen.findByRole('combobox', { name: 'ui-orders.settings.centralOrdering.receivingSearch.label' }),
      [CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.activeAffiliationDefault],
    );
    await user.click(await screen.findByRole('button', { name: 'stripes-core.button.save' }));

    expect(mockUpdateConfigSettings).toHaveBeenCalledWith(expect.objectContaining({
      value: CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.activeAffiliationDefault,
    }));
  });
});
