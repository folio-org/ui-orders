import { ARRAY_ERROR } from 'final-form';

import { omitFieldArraysAsyncErrors } from './omitFieldArraysAsyncErrors';

const ASYNC_FIELD_ARRAY = 'fieldArrayWithAsyncValidation';

describe('omitFieldArraysAsyncErrors', () => {
  it('should omit field-array from form errors if it contains only async error of array itself', () => {
    const fieldArrayErrors = [];

    fieldArrayErrors[ARRAY_ERROR] = Promise.resolve(null);

    const formErrors = {
      [ASYNC_FIELD_ARRAY]: fieldArrayErrors,
    };

    const errors = omitFieldArraysAsyncErrors(formErrors, [ASYNC_FIELD_ARRAY]);

    expect(errors).toEqual({});
  });

  it('should keep field-array in form errors object if it contains sync error of array itself', () => {
    const fieldArrayErrors = [];

    fieldArrayErrors[ARRAY_ERROR] = 'Invalid array';

    const formErrors = {
      [ASYNC_FIELD_ARRAY]: fieldArrayErrors,
    };

    const errors = omitFieldArraysAsyncErrors(formErrors, [ASYNC_FIELD_ARRAY]);

    expect(ASYNC_FIELD_ARRAY in errors).toBeTruthy();
  });

  it('should keep field-array in form errors object if it contains its fields\' errors', () => {
    const fieldArrayErrors = ['Test field is invalid'];

    fieldArrayErrors[ARRAY_ERROR] = Promise.resolve(null);

    const formErrors = {
      [ASYNC_FIELD_ARRAY]: fieldArrayErrors,
    };

    const errors = omitFieldArraysAsyncErrors(formErrors, [ASYNC_FIELD_ARRAY]);

    expect(ASYNC_FIELD_ARRAY in errors).toBeTruthy();
  });
});
