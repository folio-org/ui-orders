import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { ACQUISITION_METHODS_API } from '@folio/stripes-acq-components';

export const useAcqMethod = (methodId, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const { isLoading, data } = useQuery(
    [namespace, methodId],
    ({ signal }) => ky.get(`${ACQUISITION_METHODS_API}/${methodId}`, { signal }).json(),
    {
      enabled: Boolean(methodId),
      ...options,
    },
  );

  return ({
    acqMethod: data,
    isLoading,
  });
};
