import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { ORDERS_API } from '@folio/stripes-acq-components';

const DEFAULT_DATA = {
  current: [],
  previous: [],
};

export const useOrderFiscalYears = (orderId, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'order-fiscal-years' });

  const { data, ...rest } = useQuery({
    queryKey: [namespace, orderId, tenantId],
    queryFn: async ({ signal }) => {
      return ky.get(`${ORDERS_API}/${orderId}/fiscal-years`, { signal }).json();
    },
    enabled: enabled && Boolean(orderId),
    ...queryOptions,
  });

  return ({
    fiscalYearsGrouped: data || DEFAULT_DATA,
    ...rest,
  });
};
