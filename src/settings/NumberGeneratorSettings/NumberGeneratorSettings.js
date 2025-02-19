import { useOkapiKy } from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';
import {
  ORDERS_STORAGE_SETTINGS_API,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { useNumberGeneratorOptions } from '../hooks';
import { NUMBER_GENERATOR_SETTINGS_KEY } from './constants';
import NumberGeneratorSettingsForm from './NumberGeneratorSettingsForm';

export const NumberGeneratorSettings = () => {
  const ky = useOkapiKy();
  const showCallout = useShowCallout();

  const {
    isLoading,
    data: numberGeneratorData,
    refetch,
  } = useNumberGeneratorOptions();

  const updateSetting = (values) => {
    const value = JSON.stringify(values);

    return ky.put(`${ORDERS_STORAGE_SETTINGS_API}/${numberGeneratorData.id}`, {
      json: {
        ...numberGeneratorData,
        value,
      },
    });
  };

  const createSetting = (values) => {
    return ky.post(ORDERS_STORAGE_SETTINGS_API, {
      json: {
        key: NUMBER_GENERATOR_SETTINGS_KEY,
        value: JSON.stringify(values),
      },
    });
  };

  const onSubmit = async (values) => {
    const handler = numberGeneratorData?.id ? updateSetting : createSetting;

    return handler(values)
      .then(() => {
        refetch();
        showCallout({ messageId: 'ui-orders.settings.numberGenerator.submit.success' });
      })
      .catch(() => {
        showCallout({
          messageId: 'ui-orders.settings.numberGenerator.submit.error',
          type: 'error',
        });
      });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NumberGeneratorSettingsForm
      initialValues={numberGeneratorData ? JSON.parse(numberGeneratorData?.value) : {}}
      onSubmit={onSubmit}
    />
  );
};
