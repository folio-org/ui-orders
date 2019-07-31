import { get } from 'lodash';
import {
  ALLOWED_YEAR_LENGTH,
  INVENTORY_RECORDS_TYPE,
} from '../POLine/const';

const REQUIRED = 'Required!';

// Validate Required Field
export const required = (value) => {
  return value ? undefined : REQUIRED;
};

// Field is required only if 'vendorDetail.refNumber' isn't empty
export const requiredRefNumber = (value, allValues) => {
  const refNumber = get(allValues, 'vendorDetail.refNumber');

  return refNumber && !value
    ? REQUIRED
    : undefined;
};

// Field is required only if 'vendorDetail.refNumberType' isn't empty
export const requiredRefNumberType = (value, allValues) => {
  const refNumberType = get(allValues, 'vendorDetail.refNumberType');

  return refNumberType && !value
    ? REQUIRED
    : undefined;
};

export const validateYear = (value) => {
  if (!value) {
    return undefined;
  }
  const year = parseInt(value, 10);

  if (year >= 1000 && year <= 9999 && value.length === ALLOWED_YEAR_LENGTH) {
    return undefined;
  }

  return 'Field should be 4-digit year';
};

export { required as Required };

// Field is required only if 'createInventory' includes 'Instanse, Holding, Item'
export const isMaterialTypeRequired = (allValues, name) => {
  const fieldName = name.split('.')[0];
  const createInventory = get(allValues, `${fieldName}.createInventory`);

  return createInventory === INVENTORY_RECORDS_TYPE.all;
};
