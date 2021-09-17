import { useQuery } from 'react-query';
import { useLocation } from 'react-router';
import queryString from 'query-string';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { getFullName } from '@folio/stripes/util';
import {
  getFiltersCount,
} from '@folio/stripes-acq-components';

import { useBuildQuery } from '../useBuildQuery';

export const useOrders = ({ pagination, fetchReferences }) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'orders-list' });

  const { search } = useLocation();
  const buildQuery = useBuildQuery();
  const queryParams = queryString.parse(search);
  const query = buildQuery(queryParams);
  const filtersCount = getFiltersCount(queryParams);

  const searchParams = {
    query,
    limit: pagination.limit,
    offset: pagination.offset,
  };

  const { isFetching, data = {} } = useQuery(
    [namespace, pagination.timestamp, pagination.limit, pagination.offset],
    async () => {
      if (!filtersCount) {
        return { orders: [], ordersCount: 0 };
      }

      const { purchaseOrders, totalRecords } = await ky.get('orders/composite-orders', { searchParams }).json();
      const { usersMap, vendorsMap, acqUnitsMap } = await fetchReferences(purchaseOrders);
      const orders = purchaseOrders.map(order => ({
        ...order,
        vendorCode: vendorsMap[order.vendor]?.code,
        acquisitionsUnit: order.acqUnitIds?.map(unitId => acqUnitsMap[unitId]?.name).filter(Boolean).join(', '),
        assignedTo: getFullName(usersMap[order.assignedTo]),
      }));

      return {
        orders,
        ordersCount: totalRecords,
      };
    },
    {
      enabled: Boolean(pagination.timestamp),
      keepPreviousData: true,
    },
  );

  return ({
    ...data,
    isLoading: isFetching,
    query,
  });
};
