import { get } from 'lodash';

import { INVENTORY_RECORDS_TYPE } from '@folio/stripes-acq-components';

// Field is required only if 'createInventory' includes 'Instanse, Holding, Item'
export const isMaterialTypeRequired = (allValues, name) => {
  const fieldName = name.split('.')[0];
  const createInventory = get(allValues, `${fieldName}.createInventory`);

  return createInventory === INVENTORY_RECORDS_TYPE.all;
};
