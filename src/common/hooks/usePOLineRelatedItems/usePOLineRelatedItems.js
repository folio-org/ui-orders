import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  ITEMS_API,
} from '@folio/stripes-acq-components';

export const usePOLineRelatedItems = (poLine, { offset, limit } = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'po-line-related-items' });

  const searchParams = {
    offset,
    limit,
    query: `purchaseOrderLineIdentifier==${poLine?.id}`,
  };

  const queryKey = [namespace, limit, offset, poLine.id];
  const queryFn = ({ signal }) => ky.get(ITEMS_API, { searchParams, signal }).json();

  const {
    data,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn,
    queryOptions: {
      enabled: Boolean(poLine.id),
    },
  });

  return {
    items: data?.items || [],
    itemsCount: data?.totalRecords,
    isLoading,
    isFetching,
  };
};
