import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { usePOLineTotalEstimatedPrice } from './usePOLineTotalEstimatedPrice';

const poLine = {
  currency: 'EUR',
  poLineEstimatedPrice: 1,
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const getCurrencyRate = jest.fn(() => ({
  json: () => Promise.resolve({
    exchangeRate: 2,
  }),
}));

describe('usePOLineTotalEstimatedPrice', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: getCurrencyRate,
      });
  });

  it('should call `getPOLineTotalEstimatedPrice`', async () => {
    const { result } = renderHook(() => usePOLineTotalEstimatedPrice(), { wrapper });

    const resp = await result.current.getPOLineTotalEstimatedPrice({
      ...poLine,
      exchangeRate: 10,
      quantityPhysical: 1,
    });

    expect(resp).toEqual({ totalEstimatedPrice: 10, totalItems: 1 });
    expect(getCurrencyRate).not.toHaveBeenCalled();
  });

  it('should call `getPOLineTotalEstimatedPrice` with `getCurrencyRate`', async () => {
    const { result } = renderHook(() => usePOLineTotalEstimatedPrice(), { wrapper });

    const resp = await result.current.getPOLineTotalEstimatedPrice({
      ...poLine,
      quantityElectronic: 1,
    });

    expect(resp).toEqual({ totalEstimatedPrice: 2, totalItems: 1 });
    expect(getCurrencyRate).toHaveBeenCalled();
  });
});
