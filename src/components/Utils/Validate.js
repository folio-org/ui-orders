import { get } from 'lodash';

const REQUIRED = 'Required!';
const currentYear = new Date().getFullYear();

// Validate Required Field
export const required = (value) => {
  return value ? undefined : REQUIRED;
};

// Field is required only if 'vendor_detail.ref_number' isn't empty
export const requiredRefNumber = (value, allValues) => {
  const refNumber = get(allValues, 'vendor_detail.ref_number');

  return refNumber && !value
    ? REQUIRED
    : undefined;
};

// Field is required only if 'vendor_detail.ref_number_type' isn't empty
export const requiredRefNumberType = (value, allValues) => {
  const refNumberType = get(allValues, 'vendor_detail.ref_number_type');

  return refNumberType && !value
    ? REQUIRED
    : undefined;
};

// Validation for Fields with type 'number' requires positive integer
export const requiredPositiveNumber = (value) => {
  return value > 0
    ? undefined
    : REQUIRED;
};

export const validateYearIsPast = (value) => {
  if (!value) {
    return undefined;
  }
  const year = parseInt(value, 10);

  if (year > 1000 && year <= currentYear) {
    return undefined;
  }

  return 'Field should be 4-digit year';
};

export const someNewValidation = (value) => {
  return !value
    ? undefined
    : 'something wrong (validation message)';
};

export { required as Required };
