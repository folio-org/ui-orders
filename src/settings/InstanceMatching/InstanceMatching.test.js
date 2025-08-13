import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { CONFIG_INSTANCE_MATCHING } from '../../components/Utils/const';
import {
  useOrdersStorageSettings,
  useOrdersStorageSettingsMutation,
} from '../../common/hooks';
import InstanceMatching from './InstanceMatching';

jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useOrdersStorageSettings: jest.fn(),
  useOrdersStorageSettingsMutation: jest.fn(),
}));

const defaultProps = {
  label: 'label',
  resources: {
    instanceTypes: {
      records: [
        { code: 'text', name: 'Text' },
        { code: 'electronic', name: 'Electronic' },
        { code: 'other', name: 'Other' },
      ],
    },
  },
};

const renderInstanceMatching = (props = {}) => render(
  <InstanceMatching
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('InstanceMatching', () => {
  const refetchMock = jest.fn();
  const mutateMock = jest.fn();

  beforeEach(() => {
    useOrdersStorageSettings.mockReturnValue({
      isFetching: false,
      settings: [
        {
          id: '1',
          key: CONFIG_INSTANCE_MATCHING,
          value: true,
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

  it('should render instance matching form with description and toggle', () => {
    renderInstanceMatching();

    expect(screen.getByText('ui-orders.settings.instanceMatching.description')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.settings.instanceMatching.toggle')).toBeInTheDocument();
  });

  it('should render checkbox field for instance matching toggle', () => {
    renderInstanceMatching();

    const checkbox = screen.getByRole('checkbox', { name: 'ui-orders.settings.instanceMatching.toggle' });

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('name', 'isInstanceMatchingDisabled');
  });

  it('should render OrdersStorageSettingsManager with correct props', () => {
    renderInstanceMatching();

    expect(screen.getByText('ui-orders.settings.instanceMatching.description')).toBeInTheDocument();
  });

  it('should submit the form when save button is clicked', async () => {
    renderInstanceMatching();

    await userEvent.click(screen.getByRole('checkbox', { name: 'ui-orders.settings.instanceMatching.toggle' }));
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(mutateMock).toHaveBeenCalled();
  });
});
