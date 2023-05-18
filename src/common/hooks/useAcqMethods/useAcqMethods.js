import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  ACQUISITION_METHODS_API,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

const DEFAULT_DATA = [];

export const useAcqMethods = (options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const searchParams = {
    limit: LIMIT_MAX,
    query: 'cql.allRecords=1 sortby value',
  };

  const {
    isLoading,
    data = DEFAULT_DATA,
  } = useQuery(
    [namespace, 'acq-methods'],
    () => ky.get(ACQUISITION_METHODS_API, { searchParams }).json(),
    options,
  );

  return ({
    acqMethods: data?.acquisitionMethods,
    isLoading,
  });
};
