import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { LINES_API } from '@folio/stripes-acq-components';

export const useOrderLine = (lineId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'order-versions' });

  const { isLoading, data } = useQuery(
    [namespace, lineId],
    async ({ signal }) => ky.get(`${LINES_API}/${lineId}`, { signal }).json(),
    {
      enabled: Boolean(lineId),
    },
  );

  return ({
    orderLine: data,
    isLoading,
  });
};
