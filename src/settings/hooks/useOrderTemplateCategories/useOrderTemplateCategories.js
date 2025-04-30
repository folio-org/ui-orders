import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  ALL_RECORDS_CQL,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

import { ORDER_TEMPLATE_CATEGORIES_API } from '../../../components/Utils/api';

const DEFAULT_DATA = [];

export const useOrderTemplateCategories = (options = {}) => {
  const { enabled = true, ...queryOptions } = options;

  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'order-template-categories' });

  const searchParams = {
    limit: LIMIT_MAX,
    query: ALL_RECORDS_CQL,
  };

  const {
    data,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace],
    queryFn: ({ signal }) => ky.get(ORDER_TEMPLATE_CATEGORIES_API, { searchParams, signal }).json(),
    enabled,
    ...queryOptions,
  });

  return ({
    isFetching,
    isLoading,
    orderTemplateCategories: data?.orderTemplateCategories ?? DEFAULT_DATA,
    refetch,
    totalRecords: data?.totalRecords ?? 0,
  });
};
