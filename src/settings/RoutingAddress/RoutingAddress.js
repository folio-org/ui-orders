import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { LoadingPane } from '@folio/stripes/components';
import { useShowCallout } from '@folio/stripes-acq-components';

import { useConfigurationSettingsMutation } from '../hooks';
import { ROUTING_CONFIGURATION_USER_ADDRESS_TYPE_KEY } from './constants';
import {
  useRoutingAddressSettings,
  useUserAddressTypes,
} from './hooks';
import RoutingAddressForm from './RoutingAddressForm';

import css from '../ConfigManagerForm.css';

export const RoutingAddress = ({ label }) => {
  const showCallout = useShowCallout();
  const { addressTypes } = useUserAddressTypes();
  const { data, isFetching, refetch } = useRoutingAddressSettings();

  const { createConfigSettings, updateConfigSettings } = useConfigurationSettingsMutation();

  const addressTypeOptions = useMemo(() => addressTypes.map(({ addressType }) => ({
    label: addressType,
    value: addressType,
  })), [addressTypes]);

  const createSetting = (values) => {
    const value = values[ROUTING_CONFIGURATION_USER_ADDRESS_TYPE_KEY];

    return createConfigSettings({
      key: ROUTING_CONFIGURATION_USER_ADDRESS_TYPE_KEY,
      value,
    });
  };

  const updateSetting = (values) => {
    const value = values[ROUTING_CONFIGURATION_USER_ADDRESS_TYPE_KEY];

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
        showCallout({ messageId: 'ui-orders.settings.routingAddress.submit.success' });
      })
      .catch(() => {
        showCallout({
          messageId: 'ui-orders.settings.routingAddress.submit.error.generic',
          type: 'error',
        });
      });
  };

  if (isFetching) {
    return <LoadingPane paneTitle={label} />;
  }

  return (
    <div
      data-test-order-settings-routing-address
      className={css.formWrapper}
    >
      <RoutingAddressForm
        addressTypeOptions={addressTypeOptions}
        onSubmit={onSubmit}
        initialValues={{ [ROUTING_CONFIGURATION_USER_ADDRESS_TYPE_KEY]: data?.value }}
      />
    </div>
  );
};

RoutingAddress.propTypes = {
  label: PropTypes.object.isRequired,
};
