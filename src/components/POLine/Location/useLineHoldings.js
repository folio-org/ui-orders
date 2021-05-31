import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { batchRequest } from '@folio/stripes-acq-components';

export const useLineHoldings = (holdingIds) => {
  const ky = useOkapiKy();

  const query = useQuery(
    ['ui-orders', 'line-holdings', holdingIds],
    () => {
      return batchRequest(
        ({ params: searchParams }) => ky.get('holdings-storage/holdings', { searchParams }).json(),
        holdingIds,
      );
    },
    { enabled: Boolean(holdingIds.length) },
  );

  return ({
    holdings: query.data?.[0]?.holdingsRecords ?? [],
    ...query,
  });
};
