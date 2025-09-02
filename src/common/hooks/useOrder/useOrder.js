import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { ORDERS_API } from '@folio/stripes-acq-components';

// tries to fetch order by get, if error comes from back-end - fetch from collection api
export const useOrder = (orderId, options = {}) => {
  const {
    enabled = true,
    fiscalYearId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy();

  const {
    data,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['ui-orders', 'order', orderId, fiscalYearId],
    queryFn: async ({ signal }) => {
      try {
        const searchParams = fiscalYearId ? { fiscalYearId } : undefined;

        return ky.get(`${ORDERS_API}/${orderId}`, { signal, searchParams }).json();
      } catch {
        const searchParams = {
          query: `id==${orderId}`,
          ...(fiscalYearId ? { fiscalYearId } : {}),
        };

        const { purchaseOrders } = await ky.get(ORDERS_API, { searchParams, signal }).json();

        return purchaseOrders[0] || {};
      }
    },
    enabled: enabled && Boolean(orderId),
    ...queryOptions,
  });

  return ({
    isFetching,
    isLoading,
    order: data,
    refetch,
  });
};
