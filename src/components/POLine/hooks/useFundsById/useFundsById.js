import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';
import {
  batchRequest,
  FUNDS_API,
} from '@folio/stripes-acq-components';

const DEFAULT_VALUE = [];

export const useFundsById = (fundIds = DEFAULT_VALUE, options = {}) => {
  const { enabled = true, ...queryOptions } = options;
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'funds-by-id' });

  const fetchFn = ({ signal }) => ({ params: searchParams }) => (
    ky.get(FUNDS_API, { searchParams, signal })
      .json()
      .then(({ funds }) => funds)
  );

  const {
    data = {},
    isFetching,
    isLoading,
  } = useQuery(
    [namespace, fundIds],
    async ({ signal }) => {
      const funds = await batchRequest(
        fetchFn({ signal }),
        fundIds,
      );

      return {
        funds,
        totalRecords: funds.length,
      };
    },
    {
      enabled: enabled && Boolean(fundIds?.length),
      ...queryOptions,
    },
  );

  return ({
    isFetching,
    isLoading,
    funds: data?.funds || DEFAULT_VALUE,
    totalRecords: data?.totalRecords,
  });
};
