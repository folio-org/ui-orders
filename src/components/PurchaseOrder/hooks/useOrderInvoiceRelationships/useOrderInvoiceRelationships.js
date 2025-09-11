import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  CQLBuilder,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

import { ORDER_INVOICE_RELNS_API } from '../../../Utils/api';

const DEFAULT_DATA = [];

export const useOrderInvoiceRelationships = (orderId, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'invoices' });

  const { data, ...rest } = useQuery({
    queryKey: [namespace, orderId, tenantId],
    queryFn: async ({ signal }) => {
      const searchParams = {
        limit: LIMIT_MAX,
        query: (
          new CQLBuilder()
            .equal('purchaseOrderId', orderId)
            .build()
        ),
      };

      return ky.get(ORDER_INVOICE_RELNS_API, { searchParams, signal }).json();
    },
    enabled: enabled && Boolean(orderId),
    ...queryOptions,
  });

  return ({
    orderInvoiceRelationships: data?.orderInvoiceRelationships || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    ...rest,
  });
};
