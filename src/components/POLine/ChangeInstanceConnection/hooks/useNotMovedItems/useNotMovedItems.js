import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  batchFetch,
  ITEMS_API,
} from '@folio/stripes-acq-components';

export const useNotMovedItems = (itemIds) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'not-moved-items' });

  const queryKey = [namespace, itemIds];
  const queryFn = ({ signal }) => batchFetch(
    {
      GET: ({ params: searchParams }) => ky.get(ITEMS_API, { searchParams, signal }).json().then(({ items }) => items),
    },
    itemIds,
  );

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey,
    queryFn,
    queryOptions: {
      enabled: Boolean(itemIds.length),
    },
  });

  return {
    items: data || [],
    itemsCount: data?.length,
    isLoading,
  };
};
