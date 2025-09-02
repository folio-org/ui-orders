import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  CQLBuilder,
  LIMIT_MAX,
  LINES_API,
} from '@folio/stripes-acq-components';

const DEFAULT_DATA = [];

export const useOrderLines = (options = {}) => {
  const {
    enabled = true,
    searchParams: params = {},
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'order-lines' });

  const {
    data,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace, tenantId, ...Object.values(params)],
    queryFn: async ({ signal }) => {
      const searchParams = {
        limit: LIMIT_MAX,
        query: (
          new CQLBuilder()
            .allRecords()
            .build()
        ),
        ...params,
      };

      return ky.get(LINES_API, { searchParams, signal }).json();
    },
    enabled,
    ...queryOptions,
  });

  return ({
    orderLines: data?.poLines || DEFAULT_DATA,
    isLoading,
    isFetching,
    refetch,
    totalRecords: data?.totalRecords,
  });
};
