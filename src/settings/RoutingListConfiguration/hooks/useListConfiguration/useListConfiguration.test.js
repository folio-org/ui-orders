import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useListConfiguration } from './useListConfiguration';

const listConfig = {
  id: '9465105a-e8a1-470c-9817-142d33bc4fcd',
  description: 'List config description edit',
  localizedTemplates: {
    en: {
      header: 'List configuration',
      body: '<div>Hello {{routing.userLastName}} {{routing.userFirstName}}</div>',
    },
  },
  name: 'ROUTING_LISTS_TEMPLATE_ID',
  active: true,
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useListConfiguration', () => {
  it('should fetch routing list configuration', async () => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => listConfig,
        }),
      });

    const { result } = renderHook(() => useListConfiguration(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.listConfig).toEqual(listConfig);
  });
});
