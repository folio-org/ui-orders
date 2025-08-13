import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { CONFIG_INSTANCE_TYPE } from '../../common/constants';
import {
  useOrdersStorageSettings,
  useOrdersStorageSettingsMutation,
} from '../../common/hooks';
import InstanceType from './InstanceType';

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

const renderInstanceType = (props = {}) => render(
  <InstanceType
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('InstanceType', () => {
  beforeEach(() => {
    useOrdersStorageSettings.mockReturnValue({
      isFetching: false,
      settings: [
        {
          id: '1',
          key: CONFIG_INSTANCE_TYPE,
          value: 'text',
        },
      ],
      refetch: jest.fn(),
    });

    useOrdersStorageSettingsMutation.mockReturnValue({
      isLoading: false,
      mutateAsync: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display settings', () => {
    renderInstanceType();

    // The component should render without crashing
    expect(screen.getByText('ui-orders.settings.instanceType.select')).toBeInTheDocument();
  });

  it('should display instance type form with options', () => {
    renderInstanceType();

    // Check if the form is rendered
    expect(screen.getByText('ui-orders.settings.instanceType.select')).toBeInTheDocument();

    // Check if the select field is rendered
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
