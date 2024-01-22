import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';
import {
  batchRequest,
  FUNDS_API,
} from '@folio/stripes-acq-components';

export const useFundsById = (fundIds = [], options) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'funds-by-id' });

  const fetchFn = ({ params: searchParams }) => (
    ky.get(FUNDS_API, { searchParams })
      .json()
      .then(({ funds }) => funds)
  );

  const {
    data = {},
    isLoading,
  } = useQuery(
    [namespace, fundIds],
    async () => {
      const funds = await batchRequest(
        fetchFn,
        fundIds,
      );

      return {
        funds,
        totalRecords: funds.length,
      };
    },
    {
      enabled: Boolean(fundIds.length),
      ...options,
    },
  );

  return ({
    isLoading,
    funds: data?.funds || [],
    totalRecords: data?.totalRecords,
  });
};
