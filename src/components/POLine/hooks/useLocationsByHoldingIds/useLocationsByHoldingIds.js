import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';
import { batchRequest } from '@folio/stripes-acq-components';

import { HOLDINGS_API } from '../../../Utils/api';

const DEFAULT_VALUE = [];

export const useLocationsByHoldingIds = (holdingIds = []) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'holdings-by-id' });

  const fetchFn = ({ params: searchParams }) => (
    ky.get(HOLDINGS_API, { searchParams })
      .json()
      .then(({ holdingsRecords }) => holdingsRecords)
  );

  const {
    data = {},
    isLoading = false,
    isFetching = false,
  } = useQuery(
    [namespace, holdingIds],
    async () => {
      const holdings = await batchRequest(
        fetchFn,
        holdingIds,
      );

      const permanentLocationIds = holdings.map(({ permanentLocationId }) => permanentLocationId);

      return {
        permanentLocationIds,
        totalRecords: permanentLocationIds.length,
      };
    },
    {
      enabled: Boolean(holdingIds.length),
    },
  );

  return ({
    isLoading: isLoading || isFetching,
    permanentLocationIds: data?.permanentLocationIds || DEFAULT_VALUE,
    totalRecords: data?.totalRecords,
  });
};
