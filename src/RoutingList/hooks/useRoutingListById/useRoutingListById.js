import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  USERS_API,
  batchRequest,
} from '@folio/stripes-acq-components';

import { keyBy } from 'lodash';
import { getFullName } from '@folio/stripes/util';
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

  const { data = DEFAULT_ROUTING_LIST, isFetching, isLoading, refetch } = useQuery(
    [namespace, listingId],
    async () => {
      const routingListsRes = await ky.get(`${ROUTING_LIST_API}/${listingId}`).json();

      const users = await batchRequest(
        ({ params }) => ky.get(USERS_API, { searchParams: params }).json(),
        routingListsRes.userIds,
      ).then(responses => responses.flatMap((response) => response.users));

      const usersMap = keyBy(users, 'id');

      return ({
        ...routingListsRes,
        users: routingListsRes.userIds.map((userId) => ({
          id: userId,
          name: getFullName(usersMap[userId]),
        })),
      });
    },
    {
      enabled: Boolean(listingId),
    },
  );

  return ({
    isLoading: isLoading || isFetching,
    refetch,
    routingList: data,
  });
};
