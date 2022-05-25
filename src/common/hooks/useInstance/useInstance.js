import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';

export const useInstance = (instanceId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'instance' });

  const { isLoading, data: instance = {} } = useQuery(
    [namespace, instanceId],
    () => ky.get(`inventory/instances/${instanceId}`).json(),
    { enabled: Boolean(instanceId) },
  );

  return ({
    isLoading,
    instance,
  });
};
