import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';
import {
  ORDERS_STORAGE_SETTINGS_API,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  NUMBER_GENERATOR_SETTINGS_KEY,
} from './constants';

import NumberGeneratorSettingsForm from './NumberGeneratorSettingsForm';

const NumberGeneratorSettings = () => {
  const ky = useOkapiKy();
  const showCallout = useShowCallout();

  const useNumberGeneratorOptions = () => {
    const [namespace] = useNamespace('number-generator-options');

    const searchParams = {
      limit: 1,
      query: `key=${NUMBER_GENERATOR_SETTINGS_KEY}`,
    };

    const {
      data,
      isLoading,
      refetch,
    } = useQuery({
      queryKey: [namespace],
      queryFn: async () => {
        const response = await ky.get(ORDERS_STORAGE_SETTINGS_API, { searchParams }).json();

        if (!response?.settings || !Array.isArray(response.settings)) {
          return null;
        }

        return response?.settings?.[0];
      },
    });

    return ({
      data,
      isLoading,
      refetch,
    });
  };

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

export default NumberGeneratorSettings;
