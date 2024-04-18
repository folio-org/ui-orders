import PropTypes from 'prop-types';

import { LoadingPane } from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';
import {
  ORDERS_STORAGE_SETTINGS_API,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { useMemo } from 'react';
import css from '../ConfigManagerForm.css';

import { ROUTING_CONFIGURATION_USER_ADDRESS_TYPE_KEY } from './constants';
import {
  useRoutingAddressSettings,
  useUserAddresses,
} from './hooks';
import RoutingAddressForm from './RoutingAddressForm';

export const RoutingAddress = ({ label }) => {
  const ky = useOkapiKy();
  const showCallout = useShowCallout();
  const { addressTypes } = useUserAddresses();
  const { data, isFetching, refetch } = useRoutingAddressSettings();

  const addressTypeOptions = useMemo(() => addressTypes.map(({ addressType }) => ({
    label: addressType,
    value: addressType,
  })), [addressTypes]);

  const createSetting = (values) => {
    const value = values[ROUTING_CONFIGURATION_USER_ADDRESS_TYPE_KEY];

    return ky.post(ORDERS_STORAGE_SETTINGS_API, {
      json: {
        key: ROUTING_CONFIGURATION_USER_ADDRESS_TYPE_KEY,
        value,
      },
    });
  };

  const updateSetting = (values) => {
    const value = values[ROUTING_CONFIGURATION_USER_ADDRESS_TYPE_KEY];

    return ky.put(`${ORDERS_STORAGE_SETTINGS_API}/${data.id}`, {
      json: {
        ...data,
        value,
      },
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
