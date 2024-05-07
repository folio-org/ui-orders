import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { ROUTING_LIST_API } from '../../../common/constants';

const DEFAULT_ROUTING_LIST = {};

export const useRoutingList = (routingListId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const {
    data = DEFAULT_ROUTING_LIST,
    isLoading,
  } = useQuery(
    [namespace, routingListId],
    async () => ky.get(`${ROUTING_LIST_API}/${routingListId}`).json(),
    {
      enabled: Boolean(routingListId),
    },
  );

  return ({
    isLoading,
    routingList: data,
  });
};
