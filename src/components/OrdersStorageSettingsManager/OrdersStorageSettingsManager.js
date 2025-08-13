import get from 'lodash/get';
import {
  useCallback,
  useMemo,
} from 'react';

import { Loading } from '@folio/stripes/components';
import { ConfigFinalForm } from '@folio/stripes/smart-components';
import { useShowCallout } from '@folio/stripes-acq-components';

import {
  useOrdersStorageSettings,
  useOrdersStorageSettingsMutation,
} from '../../common/hooks';

export const OrdersStorageSettingsManager = ({
  children,
  configName,
  getInitialValues,
  label,
  onBeforeSave,
}) => {
  const showCallout = useShowCallout();

  const {
    isFetching,
    settings,
    refetch,
  } = useOrdersStorageSettings({ key: configName });

  const {
    isLoading: isMutating,
    mutateAsync,
  } = useOrdersStorageSettingsMutation();

  const initialValues = useMemo(() => {
    return typeof getInitialValues === 'function'
      ? getInitialValues(settings)
      : { [configName]: settings[0]?.value };
  }, [configName, getInitialValues, settings]);

  const onSubmit = useCallback(async (values) => {
    const value = typeof onBeforeSave === 'function' ? onBeforeSave(values) : get(values, configName);

    const data = {
      ...(settings[0] || { key: configName }),
      value,
    };

    await mutateAsync({ data })
      .then(() => {
        refetch();
        showCallout({ messageId: 'stripes-smart-components.cm.success' });
      })
      .catch(() => {
        showCallout({
          messageId: 'ui-orders.settings.update.error',
          type: 'error',
        });
      });
  }, [configName, mutateAsync, onBeforeSave, refetch, settings, showCallout]);

  const isLoading = isFetching || isMutating;

  return (
    <ConfigFinalForm
      onSubmit={onSubmit}
      initialValues={initialValues}
      label={label}
    >
      {isLoading ? <Loading /> : children}
    </ConfigFinalForm>
  );
};
