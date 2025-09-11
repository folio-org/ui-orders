import { useIntl } from 'react-intl';

import {
  TitleManager,
  useOkapiKy,
} from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';
import {
  ORDERS_STORAGE_SETTINGS_API,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { useNumberGeneratorOptions } from '../hooks';
import {
  ACCESSION_NUMBER_SETTING,
  BARCODE_SETTING,
  CALL_NUMBER_SETTING,
  NUMBER_GENERATOR_OPTIONS_OFF,
  NUMBER_GENERATOR_SETTINGS_KEY,
} from './constants';
import NumberGeneratorSettingsForm from './NumberGeneratorSettingsForm';

const DEFAULT_VALUES = {
  [ACCESSION_NUMBER_SETTING]: NUMBER_GENERATOR_OPTIONS_OFF,
  [BARCODE_SETTING]: NUMBER_GENERATOR_OPTIONS_OFF,
  [CALL_NUMBER_SETTING]: NUMBER_GENERATOR_OPTIONS_OFF,
};

export const NumberGeneratorSettings = () => {
  const intl = useIntl();
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
    return (
      <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.numberGenerator.options' })}>
        <Loading />
      </TitleManager>
    );
  }

  return (
    <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.numberGenerator.options' })}>
      <NumberGeneratorSettingsForm
        initialValues={numberGeneratorData ? JSON.parse(numberGeneratorData?.value) : DEFAULT_VALUES}
        onSubmit={onSubmit}
      />
    </TitleManager>
  );
};
