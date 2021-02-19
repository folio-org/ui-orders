import { get } from 'lodash';

import { INVENTORY_RECORDS_TYPE } from '@folio/stripes-acq-components';

// Retrieve data from mod-configuration if any or use default values

const getCreateInventorySetting = (configs) => {
  let createInventorySetting = get(configs, [0, 'value'], '{}');
  const config = {
    eresource: INVENTORY_RECORDS_TYPE.instanceAndHolding,
    physical: INVENTORY_RECORDS_TYPE.all,
    other: INVENTORY_RECORDS_TYPE.none,
  };

  try {
    createInventorySetting = JSON.parse(createInventorySetting);
  } catch (e) {
    createInventorySetting = {};
  }

  Object.assign(config, createInventorySetting);

  return config;
};

export default getCreateInventorySetting;
