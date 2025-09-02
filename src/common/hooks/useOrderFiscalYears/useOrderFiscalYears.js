import orderBy from 'lodash/orderBy';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  CQLBuilder,
  fetchFiscalYearByIds,
  LIMIT_MAX,
  ORDERS_API,
} from '@folio/stripes-acq-components';

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
    queryFn: async ({ signal }) => {
      const kyExtended = ky.extend({ signal });
      const { DESC, ASC } = CQLBuilder.SORT_ORDERS;
      const searchParams = {
        limit: LIMIT_MAX,
        query: (
          new CQLBuilder()
            .allRecords()
            .sortByMultiple([
              { field: 'periodStart', order: DESC },
              { field: 'series', order: ASC },
            ])
            .build()
        ),
      };

      const { fiscalYearIds } = await kyExtended.get(`${ORDERS_API}/${orderId}/fiscal-years`, { searchParams }).json();
      const { fiscalYears, totalRecords } = await fetchFiscalYearByIds(kyExtended)(fiscalYearIds);

      return {
        fiscalYears: orderBy(fiscalYears, ['periodStart', 'code'], [DESC, ASC]),
        totalRecords,
      };
    },
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
