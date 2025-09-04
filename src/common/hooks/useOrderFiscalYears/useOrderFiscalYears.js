import orderBy from 'lodash/orderBy';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  CQLBuilder,
  ORDERS_API,
} from '@folio/stripes-acq-components';

const { DESC, ASC } = CQLBuilder.SORT_ORDERS;
const DEFAULT_DATA = [];

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
    queryFn: async ({ signal }) => (
      ky.get(`${ORDERS_API}/${orderId}/fiscal-years`, { signal })
        .json()
        .then(({ fiscalYears, ..._rest }) => ({
          ..._rest,
          fiscalYears: orderBy(fiscalYears, ['periodStart', 'code'], [DESC, ASC]),
        }))
    ),
    enabled: enabled && Boolean(orderId),
    ...queryOptions,
  });

  return ({
    fiscalYears: data?.fiscalYears || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    ...rest,
  });
};
