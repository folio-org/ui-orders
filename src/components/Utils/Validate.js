import React from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  ALLOWED_YEAR_LENGTH,
  INVENTORY_RECORDS_TYPE,
} from '../POLine/const';

const NOT_VALID_YEAR = <FormattedMessage id="ui-orders.validation.year" />;

export const validateYear = (value) => {
  if (!value) {
    return undefined;
  }
  const year = parseInt(value, 10);

  if (year >= 1000 && year <= 9999 && value.length === ALLOWED_YEAR_LENGTH) {
    return undefined;
  }

  return NOT_VALID_YEAR;
};

// Field is required only if 'createInventory' includes 'Instanse, Holding, Item'
export const isMaterialTypeRequired = (allValues, name) => {
  const fieldName = name.split('.')[0];
  const createInventory = get(allValues, `${fieldName}.createInventory`);

  return createInventory === INVENTORY_RECORDS_TYPE.all;
};
