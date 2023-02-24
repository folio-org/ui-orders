import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { ORDERS_API } from '@folio/stripes-acq-components';

import { updateOrderResource } from '../../../Utils/orderResource';

export const useOrderMutation = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync: updateOrder } = useMutation({
    mutationFn: async ({
      searchParams,
      order,
      changedData,
    } = {}) => {
      const mutatorAdapter = {
        PUT: (orderData) => ky.put(`${ORDERS_API}/${orderData.id}`, { searchParams, json: orderData }),
      };

      return updateOrderResource(order, mutatorAdapter, changedData).json();
    },
    ...options,
  });

  return {
    updateOrder,
  };
};
