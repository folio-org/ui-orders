import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { ORDERS_STORAGE_SETTINGS_API } from '@folio/stripes-acq-components';

export const useOrdersStorageSettingsMutation = () => {
  const ky = useOkapiKy();

  const {
    mutateAsync,
    isLoading,
  } = useMutation({
    mutationFn: async ({ data }) => {
      return data?.id
        ? ky.put(`${ORDERS_STORAGE_SETTINGS_API}/${data?.id}`, { json: data })
        : ky.post(ORDERS_STORAGE_SETTINGS_API, { json: data });
    },
  });

  return {
    isLoading,
    mutateAsync,
  };
};
