import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { INVENTORY_RECORDS_TYPE } from '@folio/stripes-acq-components';

import { CONFIG_CREATE_INVENTORY } from '../../components/Utils/const';
import {
  useOrdersStorageSettings,
  useOrdersStorageSettingsMutation,
} from '../../common/hooks';
import CreateInventory from './CreateInventory';

jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useOrdersStorageSettings: jest.fn(),
  useOrdersStorageSettingsMutation: jest.fn(),
}));

const defaultProps = {
  label: 'Create inventory label',
};

const renderCreateInventory = (props = {}) => render(
  <CreateInventory
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('CreateInventory', () => {
  const refetchMock = jest.fn();
  const mutateMock = jest.fn();

  beforeEach(() => {
    useOrdersStorageSettings.mockReturnValue({
      isFetching: false,
      settings: [
        {
          id: '1',
          key: CONFIG_CREATE_INVENTORY,
          value: JSON.stringify({
            eresource: INVENTORY_RECORDS_TYPE.none,
            physical: INVENTORY_RECORDS_TYPE.none,
            other: INVENTORY_RECORDS_TYPE.none,
          }),
        },
      ],
      refetch: refetchMock,
    });

    useOrdersStorageSettingsMutation.mockReturnValue({
      isLoading: false,
      mutateAsync: mutateMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render create inventory form fields', () => {
    renderCreateInventory();

    expect(screen.getByText('ui-orders.settings.createInventory.eresource')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.settings.createInventory.physical')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.settings.createInventory.other')).toBeInTheDocument();
  });

  it('should call mutateAsync on save', async () => {
    renderCreateInventory();

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'ui-orders.settings.createInventory.eresource' }),
      [INVENTORY_RECORDS_TYPE.all],
    );

    await userEvent.click(screen.getByRole('button', { name: 'stripes-core.button.save' }));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled();
    });
  });

  it('should submit values serialized by onBeforeSave', async () => {
    renderCreateInventory();

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'ui-orders.settings.createInventory.eresource' }),
      [INVENTORY_RECORDS_TYPE.all],
    );

    await userEvent.click(screen.getByRole('button', { name: 'stripes-core.button.save' }));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled();
    });

    const lastCallArg = mutateMock.mock.calls.at(-1)?.[0];

    expect(lastCallArg).toMatchObject({
      data: {
        id: '1',
        key: CONFIG_CREATE_INVENTORY,
        value: JSON.stringify({
          eresource: INVENTORY_RECORDS_TYPE.all,
          physical: INVENTORY_RECORDS_TYPE.none,
          other: INVENTORY_RECORDS_TYPE.none,
        }),
      },
    });
  });
});
