import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { ORDERS_API } from '@folio/stripes-acq-components';

import { updateOrderResource } from '../../../Utils/orderResource';

export const useOrderMutation = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync: mutateOrder } = useMutation({
    mutationFn: async ({
      searchParams,
      order,
      changedData,
    } = {}) => {
      const mutatorAdapter = {
        POST: (orderData) => ky.post(ORDERS_API, { json: orderData }),
        PUT: (orderData) => ky.put(`${ORDERS_API}/${orderData.id}`, { searchParams, json: orderData }),
      };

      return updateOrderResource(order, mutatorAdapter, changedData).json();
    },
    ...options,
  });

  return {
    mutateOrder,
  };
};
