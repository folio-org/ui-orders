import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { ORDER_TEMPLATES_API } from '../../../components/Utils/api';

const DEFAULT_DATA = {};

export const useOrderTemplate = (orderTemplateId, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const namespace = useNamespace({ key: 'order-template' });

  const { data, ...rest } = useQuery({
    queryKey: [namespace, orderTemplateId, tenantId],
    queryFn: ({ signal }) => ky.get(`${ORDER_TEMPLATES_API}/${orderTemplateId}`, { signal }).json(),
    enabled: enabled && Boolean(orderTemplateId),
    ...queryOptions,
  });

  return ({
    orderTemplate: data || DEFAULT_DATA,
    ...rest,
  });
};
