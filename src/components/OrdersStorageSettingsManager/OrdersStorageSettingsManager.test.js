import { Field } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { OrdersStorageSettingsManager } from './OrdersStorageSettingsManager';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn(() => <div>Loading</div>),
}));

jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useOrdersStorageSettings: jest.fn(),
  useOrdersStorageSettingsMutation: jest.fn(),
}));

const mockUseOrdersStorageSettings = require('../../common/hooks').useOrdersStorageSettings;
const mockUseOrdersStorageSettingsMutation = require('../../common/hooks').useOrdersStorageSettingsMutation;

const defaultProps = {
  configName: 'test-config',
  getInitialValues: jest.fn((settings) => ({ testField: settings?.[0]?.value || '' })),
  label: 'Test Label',
  onBeforeSave: jest.fn((data) => JSON.stringify(data)),
  children: <div>Test Form</div>,
};

const renderComponent = (props = {}) => render(
  <OrdersStorageSettingsManager
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('OrdersStorageSettingsManager', () => {
  const refetchMock = jest.fn();
  const mutateAsyncMock = jest.fn();

  beforeEach(() => {
    mockUseOrdersStorageSettings.mockReturnValue({
      isFetching: false,
      settings: [
        {
          id: '1',
          key: 'test-config',
          value: 'test-value',
        },
      ],
      refetch: refetchMock,
    });

    mockUseOrdersStorageSettingsMutation.mockReturnValue({
      isLoading: false,
      mutateAsync: mutateAsyncMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('should call getInitialValues with settings', () => {
    renderComponent();

    expect(defaultProps.getInitialValues).toHaveBeenCalledWith([
      {
        id: '1',
        key: 'test-config',
        value: 'test-value',
      },
    ]);
  });

  it('should call mutateAsync on form submit', async () => {
    const TestForm = (
      <form>
        <Field
          id="test"
          component="input"
          name="test"
          label="test"
        />
      </form>
    );

    renderComponent({ children: TestForm });

    await userEvent.type(screen.getByRole('textbox'), 'hello');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalled();
    });
  });

  it('should show loading state when isFetching is true', () => {
    mockUseOrdersStorageSettings.mockReturnValue({
      isFetching: true,
      settings: [],
      refetch: refetchMock,
    });

    renderComponent();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
