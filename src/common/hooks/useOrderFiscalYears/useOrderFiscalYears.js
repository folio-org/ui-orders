import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { ORDERS_API } from '@folio/stripes-acq-components';

const DEFAULT_DATA = [];

export const useOrderFiscalYears = (orderId, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'order-fiscal-years' });

  const {
    data,
    isFetching,
    isFetched,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace, orderId, tenantId],
    queryFn: async ({ signal }) => ky.get(`${ORDERS_API}/${orderId}/fiscal-years`, { signal }).json(),
    enabled: enabled && Boolean(orderId),
    ...queryOptions,
  });

  return ({
    fiscalYears: data?.fiscalYears || DEFAULT_DATA,
    isLoading,
    isFetched,
    isFetching,
    refetch,
    totalRecords: data?.totalRecords,
  });
};
