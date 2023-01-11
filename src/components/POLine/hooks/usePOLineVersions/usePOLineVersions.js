import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { AUDIT_ACQ_EVENTS_API } from '../../../../common/constants';

export const usePOLineVersions = (poLineId, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'order-line-versions' });

  const { isLoading, data } = useQuery(
    [namespace, poLineId],
    () => ky.get(`${AUDIT_ACQ_EVENTS_API}/order-line/${poLineId}`).json(),
    {
      enabled: Boolean(poLineId),
      ...options,
    },
  );

  return {
    isLoading,
    versions: data?.orderLineAuditEvents || [],
  };
};
