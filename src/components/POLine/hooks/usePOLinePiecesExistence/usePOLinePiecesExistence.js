import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  CQLBuilder,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

export const usePOLinePiecesExistence = (poLineId, options = {}) => {
  const {
    enabled = true,
    receivingStatus = '*',
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'po-line-received-pieces-existence' });

  const { data, ...rest } = useQuery({
    queryKey: [namespace, poLineId, tenantId, receivingStatus],
    queryFn: ({ signal }) => {
      const searchParams = {
        limit: 1, // We only need to know if at least one piece exists
        query: (
          new CQLBuilder()
            .equal('poLineId', poLineId)
            .equal('receivingStatus', receivingStatus)
            .build()
        ),
      };

      return ky.get(ORDER_PIECES_API, { searchParams, signal }).json();
    },
    enabled: enabled && Boolean(poLineId),
    ...queryOptions,
  });

  return {
    isExist: data?.totalRecords > 0,
    ...rest,
  };
};
