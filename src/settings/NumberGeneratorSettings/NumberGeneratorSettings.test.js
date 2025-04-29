import {
  ORDERS_STORAGE_SETTINGS_API,
  useShowCallout,
} from '@folio/stripes-acq-components';
import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useOkapiKy } from '@folio/stripes/core';

import { useNumberGeneratorOptions } from '../hooks';
import { NumberGeneratorSettings } from './NumberGeneratorSettings';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  TitleManager: jest.fn(({ children }) => <div>{children}</div>),
  useOkapiKy: jest.fn(),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  useShowCallout: jest.fn(),
  ORDERS_STORAGE_SETTINGS_API: '/orders-storage/settings',
}));

jest.mock('../hooks/useNumberGeneratorOptions');

jest.mock('@folio/stripes/components', () => ({
  Loading: () => <div>Loading</div>,
}));

jest.mock('./constants', () => ({
  ...jest.requireActual('./constants'),
  NUMBER_GENERATOR_SETTINGS_KEY: 'testKey',
}));

jest.mock('./NumberGeneratorSettingsForm', () => jest.fn(({ onSubmit }) => (
  <button
    onClick={() => onSubmit({ barcode: 'testValue' })}
    type="button"
  >
    Save
  </button>
)));

const renderComponent = () => render(<NumberGeneratorSettings />);

describe('NumberGeneratorSettings', () => {
  const mockKyPut = jest.fn();
  const mockKyPost = jest.fn();
  const mockSendCallout = jest.fn();

  beforeEach(() => {
    useOkapiKy.mockReturnValue({
      put: mockKyPut,
      post: mockKyPost,
    });
    useShowCallout.mockReturnValue(mockSendCallout);
  });

  it('should render Loading', () => {
    useNumberGeneratorOptions.mockReturnValue({ isLoading: true });
    renderComponent();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should render NumberGeneratorSettingsForm', () => {
    useNumberGeneratorOptions.mockReturnValue({ isLoading: false, data: null });
    renderComponent();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('should call ky.post when no setting is present', async () => {
    useNumberGeneratorOptions.mockReturnValue({ isLoading: false, data: null, refetch: jest.fn() });
    mockKyPost.mockResolvedValue({});
    renderComponent();

    await userEvent.click(screen.getByText('Save'));

    expect(mockKyPost).toHaveBeenCalledWith(ORDERS_STORAGE_SETTINGS_API, {
      json: { key: 'testKey', value: JSON.stringify({ barcode: 'testValue' }) },
    });
    expect(mockSendCallout).toHaveBeenCalledWith({
      messageId: 'ui-orders.settings.numberGenerator.submit.success',
    });
  });

  it('should call ky.put when setting exists', async () => {
    const numberGeneratorData = { id: '123', key: 'testKey', value: JSON.stringify({ barcode: 'testValue' }) };

    mockKyPut.mockResolvedValue({ });
    useNumberGeneratorOptions.mockReturnValue({
      isLoading: false,
      data: numberGeneratorData,
      refetch: jest.fn(),
    });
    renderComponent();

    await userEvent.click(screen.getByText('Save'));

    expect(mockKyPut).toHaveBeenCalledWith(`${ORDERS_STORAGE_SETTINGS_API}/${numberGeneratorData.id}`, {
      json: { ...numberGeneratorData, value: JSON.stringify({ barcode: 'testValue' }) },
    });
    expect(mockSendCallout).toHaveBeenCalledWith({
      messageId: 'ui-orders.settings.numberGenerator.submit.success',
    });
  });

  it('should show error callout when submission fails', async () => {
    useNumberGeneratorOptions.mockReturnValue({ isLoading: false });
    mockKyPost.mockRejectedValue(new Error());
    renderComponent();

    await userEvent.click(screen.getByText('Save'));

    expect(mockSendCallout).toHaveBeenCalledWith({
      type: 'error',
      messageId: 'ui-orders.settings.numberGenerator.submit.error',
    });
  });
});
