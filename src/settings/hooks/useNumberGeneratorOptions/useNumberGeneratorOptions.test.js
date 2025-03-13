import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import {
  NUMBER_GENERATOR_OPTIONS_OFF,
  NUMBER_GENERATOR_OPTIONS_ONEDITABLE,
  NUMBER_GENERATOR_SETTINGS_KEY,
} from '../../NumberGeneratorSettings/constants';
import { useNumberGeneratorOptions } from './useNumberGeneratorOptions';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const NUMBER_GENERATOR = {
  barcode: NUMBER_GENERATOR_OPTIONS_OFF,
  accessionNumber: NUMBER_GENERATOR_OPTIONS_ONEDITABLE,
  callNumber: NUMBER_GENERATOR_OPTIONS_ONEDITABLE,
  useSharedNumber: 'false',
};

const mockData = {
  id: '8cc688c4-e7da-438e-98a7-d101cad104f4',
  key: NUMBER_GENERATOR_SETTINGS_KEY,
  value: NUMBER_GENERATOR,
};

describe('useNumberGeneratorOptions', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({ settings: [mockData] }),
        }),
      });
  });

  it('should fetch number generator options', async () => {
    const { result } = renderHook(() => useNumberGeneratorOptions(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current).toEqual(expect.objectContaining({
      isLoading: false,
      data: mockData,
    }));
  });
});
