import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { ORDERS_STORAGE_SETTINGS_API } from '@folio/stripes-acq-components';

import { ROUTING_CONFIGURATION_USER_ADDRESS_TYPE_KEY } from '../../constants';

export const useRoutingAddressSettings = (options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace('routing-address-settings');

  const searchParams = {
    limit: 1,
    query: `key=${ROUTING_CONFIGURATION_USER_ADDRESS_TYPE_KEY}`,
  };

  const {
    data,
    isFetching,
    refetch,
    error,
  } = useQuery({
    queryKey: [namespace],
    queryFn: async () => {
      const response = await ky.get(ORDERS_STORAGE_SETTINGS_API, { searchParams }).json();

      return response?.settings?.[0];
    },
    ...options,
  });

  return ({
    data,
    error,
    isLoading: isFetching,
    refetch,
  });
};
