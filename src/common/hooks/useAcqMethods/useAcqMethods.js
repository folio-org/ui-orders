import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import {
  ACQUISITION_METHODS_API,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

export const useAcqMethods = () => {
  const ky = useOkapiKy();

  const searchParams = {
    limit: LIMIT_MAX,
    query: 'cql.allRecords=1 sortby value',
  };

  const { isLoading, data } = useQuery(
    ['ui-orders', 'acq-methods'],
    () => ky.get(ACQUISITION_METHODS_API, { searchParams }).json(),
  );

  return ({
    acqMethods: data?.['acquisition_methods'] ?? [],
    isLoading,
  });
};
