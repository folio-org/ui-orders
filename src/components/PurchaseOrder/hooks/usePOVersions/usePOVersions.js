import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { CQLBuilder } from '@folio/stripes-acq-components';

import { AUDIT_ACQ_EVENTS_API } from '../../../../common/constants';

export const usePOVersions = (orderId, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'order-versions' });

  const { isLoading, data } = useQuery({
    queryKey: [namespace, orderId],
    queryFn: ({ signal }) => {
      const searchParams = {
        sortBy: 'event_date',
        sortOrder: CQLBuilder.SORT_ORDERS.DESC,
      };

      return ky.get(`${AUDIT_ACQ_EVENTS_API}/order/${orderId}`, { searchParams, signal }).json();
    },
    enabled: Boolean(orderId),
    ...options,
  });

  return {
    isLoading,
    versions: data?.orderAuditEvents || [],
  };
};
