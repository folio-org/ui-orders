import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useOrderTemplateCategories } from './useOrderTemplateCategories';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const orderTemplateCategories = [
  {
    id: '1',
    name: 'Category 1',
  }, {
    id: '2',
    name: 'Category 2',
  },
];

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({ orderTemplateCategories }),
  })),
};

describe('useOrderTemplateCategories', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch order template categories', async () => {
    const { result } = renderHook(() => useOrderTemplateCategories(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.orderTemplateCategories).toEqual(orderTemplateCategories);
  });
});
