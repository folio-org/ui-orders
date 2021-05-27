import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useHoldings = (options) => {
  const ky = useOkapiKy();

  const query = useQuery(
    ['holdings-storage/holdings', options],
    () => ky.get('holdings-storage/holdings', options).json(),
  );

  return ({
    holdings: query.data?.holdingsRecords ?? [],
    ...query,
  });
};
