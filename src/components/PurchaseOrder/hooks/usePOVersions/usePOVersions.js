import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { AUDIT_ACQ_EVENTS_API } from '../../../../common/constants';

export const usePOVersions = (orderId, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'order-versions' });

  const { isLoading, data } = useQuery(
    [namespace, orderId],
    ({ signal }) => ky.get(`${AUDIT_ACQ_EVENTS_API}/order/${orderId}`, { signal }).json(),
    {
      enabled: Boolean(orderId),
      ...options,
    },
  );

  return {
    isLoading,
    versions: data?.orderAuditEvents || [],
  };
};
