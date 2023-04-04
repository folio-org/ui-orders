import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';

import { ORDER_TEMPLATES_API } from '../../../components/Utils/api';

export const useOrderTemplate = (orderTemplateId) => {
  const ky = useOkapiKy();
  const namespace = useNamespace({ key: 'order-template' });

  const {
    isFetching,
    isLoading,
    data = {},
  } = useQuery(
    [namespace, orderTemplateId],
    () => ky.get(`${ORDER_TEMPLATES_API}/${orderTemplateId}`).json(),
    { enabled: Boolean(orderTemplateId) },
  );

  return ({
    orderTemplate: data,
    isFetching,
    isLoading,
  });
};
