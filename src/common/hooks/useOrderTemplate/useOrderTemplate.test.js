import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useOrderTemplate } from './useOrderTemplate';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useOrderTemplate', () => {
  it('should fetch order template', async () => {
    const orderTemplate = {
      id: 'orderTemplateId',
    };

    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => orderTemplate,
      }),
    });

    const { result, waitFor } = renderHook(() => useOrderTemplate(orderTemplate.id), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.orderTemplate).toEqual(orderTemplate);
  });
});
