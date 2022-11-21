import { ARRAY_ERROR } from 'final-form';
import {
  cloneDeep,
  get,
  unset,
} from 'lodash';

/*
  Final form async validation of field array itself return a Promise instead of resolved value
  and set it as "FINAL_FORM/array-error". So form always contain this promise in form's
  errors object even if there no actual validation error.

  Issue: https://github.com/final-form/react-final-form-arrays/issues/176
*/
export const omitFieldArraysAsyncErrors = (formErrors, asyncFieldArrays = []) => {
  const cloned = cloneDeep(formErrors);

  asyncFieldArrays.forEach((field) => {
    const arrayFieldAsyncError = get(formErrors, `${field}[${ARRAY_ERROR}].then`);

    if (arrayFieldAsyncError && !get(formErrors, field, []).filter(Boolean).length) {
      unset(cloned, field);
    }
  });

  return cloned;
};
