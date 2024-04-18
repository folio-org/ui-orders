import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { ORDERS_STORAGE_SETTINGS_API } from '@folio/stripes-acq-components';

export const useConfigurationSettingsMutation = () => {
  const ky = useOkapiKy();

  const createSetting = (values) => {
    return ky.post(ORDERS_STORAGE_SETTINGS_API, {
      json: values,
    });
  };

  const updateSetting = (values) => {
    return ky.put(`${ORDERS_STORAGE_SETTINGS_API}/${values.id}`, {
      json: values,
    });
  };

  const { mutateAsync: createConfigSettings, isCreating } = useMutation({ mutationFn: createSetting });
  const { mutateAsync: updateConfigSettings, isLoading: isUpdating } = useMutation({ mutationFn: updateSetting });

  return {
    createConfigSettings,
    isCreating,
    isUpdating,
    updateConfigSettings,
  };
};
