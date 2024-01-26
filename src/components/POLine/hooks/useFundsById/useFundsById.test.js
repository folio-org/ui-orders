import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useFundsById } from './useFundsById';

const fundIds = ['1', '2'];
const funds = [{
  id: '1',
  code: 'fundCode',
},
{
  id: '2',
  code: 'fundCode',
},
];

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useFundsById', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({
            funds,
            totalRecords: funds.length,
          }),
        }),
      });
  });

  it('should return funds list', async () => {
    const { result } = renderHook(() => useFundsById(fundIds), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.funds).toEqual(funds);
  });
});
