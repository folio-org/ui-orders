import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  CQLBuilder,
  LIMIT_MAX,
  ORDERS_STORAGE_SETTINGS_API,
} from '@folio/stripes-acq-components';

const DEFAULT_DATA = [];

export const useOrdersStorageSettings = (options = {}) => {
  const { key, ...queryOptions } = options;

  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: `orders-storage-settings${key || ''}` });

  const cql = new CQLBuilder();
  const searchParams = {
    limit: LIMIT_MAX,
    query: (
      (key ? cql.equal('key', key) : cql.allRecords())
        .sortBy('value')
        .build()
    ),
  };

  const {
    data,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace, key],
    queryFn: ({ signal }) => ky.get(ORDERS_STORAGE_SETTINGS_API, { searchParams, signal }).json(),
    ...queryOptions,
  });

  return ({
    isFetching,
    isLoading,
    refetch,
    settings: data?.settings || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
  });
};
