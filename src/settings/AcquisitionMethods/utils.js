import React from 'react';
import { FormattedMessage } from 'react-intl';

import { MODULE_ORDERS } from '@folio/stripes-acq-components';

export const CONFIG_ACQ_METHODS = 'acquisitionMethods';

export const getAcqMethodsConfig = ({ id, name }) => ({
  id,
  module: MODULE_ORDERS,
  configName: CONFIG_ACQ_METHODS,
  code: `${CONFIG_ACQ_METHODS.toUpperCase()}_${name.trim().toUpperCase().replaceAll(' ', '_')}`,
});

export const parseAcqMethodRow = entry => {
  let value;

  try {
    value = JSON.parse(entry.value);
  } catch (e) {
    value = {};
  }

  return {
    name: value.name,
    id: entry?.id,
  };
};

export const validateAcqMethods = ({ items }) => {
  const errors = items?.map(({ name }) => ({
    name: !name?.length
      ? <FormattedMessage id="ui-orders.settings.acquisitionMethods.validation.name" />
      : undefined,
  }));

  return { items: errors };
};
