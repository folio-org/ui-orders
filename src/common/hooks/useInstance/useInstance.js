import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from '../useTenantKy';

const DEFAULT_DATA = {};
const DEFAULT_OPTIONS = {};

export const useInstance = (instanceId, options = DEFAULT_OPTIONS) => {
  const { tenantId } = options;

  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: 'instance' });

  const {
    isLoading,
    data: instance = DEFAULT_DATA,
  } = useQuery(
    [namespace, instanceId, tenantId],
    ({ signal }) => ky.get(`inventory/instances/${instanceId}`, { signal }).json(),
    { enabled: Boolean(instanceId) },
  );

  return ({
    isLoading,
    instance,
  });
};
