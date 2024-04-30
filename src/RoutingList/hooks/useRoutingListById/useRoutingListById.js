import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { ROUTING_LIST_API } from '../../../common/constants';

const DEFAULT_ROUTING_LIST = {
  name: '',
  notes: '',
  userIds: [],
  users: [],
};

export const useRoutingListById = (listingId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const {
    data = DEFAULT_ROUTING_LIST,
    isFetching,
    isLoading,
  } = useQuery(
    [namespace, listingId],
    async () => ky.get(`${ROUTING_LIST_API}/${listingId}`).json(),
    {
      enabled: Boolean(listingId),
    },
  );

  return ({
    isLoading: isLoading || isFetching,
    routingList: data,
  });
};
