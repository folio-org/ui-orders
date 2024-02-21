import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { usePOLineTotalEstimatedPrice } from './usePOLineTotalEstimatedPrice';

const poLine = {
  currency: 'EUR',
  exchangeRate: 1,
  poLineEstimatedPrice: 1,
  quantityElectronic: 0,
  quantityPhysical: 1,
};

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

describe('getPOLineTotalEstimatedPrice', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: jest.fn(() => ({
          json: () => Promise.resolve({
            exchangeRate: 2,
          }),
        })),
      });
  });

  it('should call `getCurrencyRate`', async () => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: jest.fn(() => ({
          json: () => Promise.resolve({
            exchangeRate: 1,
          }),
        })),
      });

    const { result } = renderHook(() => usePOLineTotalEstimatedPrice(fundIds), { wrapper });

    const resp = await result.current.getPOLineTotalEstimatedPrice({ poLine });

    expect(resp).toEqual(1);
  });
});
