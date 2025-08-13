import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { CONFIG_OPEN_ORDER } from '../../components/Utils/const';
import {
  useOrdersStorageSettings,
  useOrdersStorageSettingsMutation,
} from '../../common/hooks';
import OpenOrder from './OpenOrder';

jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useOrdersStorageSettings: jest.fn(),
  useOrdersStorageSettingsMutation: jest.fn(),
}));

const defaultProps = {
  label: 'Open order label',
};

const renderOpenOrder = (props = {}) => render(
  <OpenOrder
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('OpenOrder', () => {
  const refetchMock = jest.fn();
  const mutateMock = jest.fn();

  beforeEach(() => {
    useOrdersStorageSettings.mockReturnValue({
      isFetching: false,
      settings: [
        {
          id: '1',
          key: CONFIG_OPEN_ORDER,
          value: JSON.stringify({ isOpenOrderEnabled: true }),
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

  it('should render open order form', () => {
    renderOpenOrder();

    expect(screen.getByText('ui-orders.settings.openOrder.isOpenOrderEnabled')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.settings.openOrder.isDuplicateCheckDisabled')).toBeInTheDocument();
  });

  it('should call mutateAsync on save', async () => {
    renderOpenOrder();

    await userEvent.click(screen.getByRole('checkbox', { name: 'ui-orders.settings.openOrder.isOpenOrderEnabled' }));
    await userEvent.click(screen.getByRole('button', { name: 'stripes-core.button.save' }));

    expect(mutateMock).toHaveBeenCalled();
  });
});
