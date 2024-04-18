import { FormattedMessage } from 'react-intl';

import { LoadingPane } from '@folio/stripes/components';
import { useShowCallout } from '@folio/stripes-acq-components';

import { CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH_SETTINGS_KEY } from '../../common/constants';
import {
  useConfigurationSettingsMutation,
  useDefaultReceivingSearchSettings,
} from '../hooks';
import CentralOrderingForm from './CentralOrderingForm';

export const CentralOrdering = () => {
  const showCallout = useShowCallout();

  const {
    isFetching,
    data,
    refetch,
  } = useDefaultReceivingSearchSettings();
  const { createConfigSettings, updateConfigSettings } = useConfigurationSettingsMutation();

  const createSetting = (values) => {
    const value = values[CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH_SETTINGS_KEY];

    return createConfigSettings({
      key: CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH_SETTINGS_KEY,
      value,
    });
  };

  const updateSetting = (values) => {
    const value = values[CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH_SETTINGS_KEY];

    return updateConfigSettings({
      ...data,
      value,
    });
  };

  const onSubmit = async (values) => {
    const handler = data?.id ? updateSetting : createSetting;

    return handler(values)
      .then(() => {
        refetch();
        showCallout({ messageId: 'ui-orders.settings.centralOrdering.submit.success' });
      })
      .catch(() => {
        showCallout({
          messageId: 'ui-orders.settings.centralOrdering.submit.error.generic',
          type: 'error',
        });
      });
  };

  if (isFetching) {
    return <LoadingPane paneTitle={<FormattedMessage id="ui-orders.settings.centralOrdering.label" />} />;
  }

  return (
    <CentralOrderingForm
      onSubmit={onSubmit}
      initialValues={{ [CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH_SETTINGS_KEY]: data?.value }}
    />
  );
};
