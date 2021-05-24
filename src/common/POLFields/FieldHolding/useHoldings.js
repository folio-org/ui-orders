import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

export const useHoldings = (instanceId) => {
  const ky = useOkapiKy();
  const searchParams = { query: `instanceId==${instanceId}`, limit: LIMIT_MAX };

  const { isLoading: isHoldingsLoading, data = {} } = useQuery(
    ['poLine-instance-holdings', instanceId],
    () => ky.get('holdings-storage/holdings', { searchParams }).json(),
    { enabled: Boolean(instanceId) },
  );

  return ({
    isHoldingsLoading,
    holdings: data.holdingsRecords,
  });
};
