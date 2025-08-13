import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { CONFIG_ORDER_NUMBER } from '../../components/Utils/const';
import {
  useOrdersStorageSettings,
  useOrdersStorageSettingsMutation,
} from '../../common/hooks';
import OrderNumber from './OrderNumber';

jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useOrdersStorageSettings: jest.fn(),
  useOrdersStorageSettingsMutation: jest.fn(),
}));

const defaultProps = {
  label: 'Order number label',
};

const renderOrderNumber = (props = {}) => render(
  <OrderNumber
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('OrderNumber', () => {
  const refetchMock = jest.fn();
  const mutateMock = jest.fn();

  beforeEach(() => {
    useOrdersStorageSettings.mockReturnValue({
      isFetching: false,
      settings: [
        {
          id: '1',
          key: CONFIG_ORDER_NUMBER,
          value: JSON.stringify({ prefix: 'PO', startNumber: 1000 }),
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

  it('should render order number form with label', () => {
    renderOrderNumber();

    expect(screen.getByText('ui-orders.settings.poNumber.editPONumber')).toBeInTheDocument();
  });

  it('should call mutateAsync on save', async () => {
    renderOrderNumber();

    await userEvent.click(screen.getByRole('checkbox', { name: 'ui-orders.settings.poNumber.editPONumber' }));
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(mutateMock).toHaveBeenCalled();
  });
});
