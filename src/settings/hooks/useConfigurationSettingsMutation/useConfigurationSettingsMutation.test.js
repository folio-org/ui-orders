import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { ORDERS_STORAGE_SETTINGS_API } from '@folio/stripes-acq-components';

import { useConfigurationSettingsMutation } from './useConfigurationSettingsMutation';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const putMock = jest.fn();
const postMock = jest.fn();
const configData = {
  id: 'test-id',
  value: 'test',
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useConfigurationSettingsMutation', () => {
  beforeEach(() => {
    putMock.mockClear();
    postMock.mockClear();
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        put: putMock,
        post: postMock,
      });
  });

  it('should call `createConfigSettings` mutation', async () => {
    const { result } = renderHook(() => useConfigurationSettingsMutation(), { wrapper });

    await result.current.createConfigSettings(configData);
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(postMock).toHaveBeenCalledWith(ORDERS_STORAGE_SETTINGS_API, expect.objectContaining({}));
  });

  it('should call `updateConfigSettings` mutation', async () => {
    const { result } = renderHook(() => useConfigurationSettingsMutation(), { wrapper });

    await result.current.updateConfigSettings(configData);
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(putMock).toHaveBeenCalledWith(`${ORDERS_STORAGE_SETTINGS_API}/${configData.id}`, expect.objectContaining({
      json: configData,
    }));
  });
});
