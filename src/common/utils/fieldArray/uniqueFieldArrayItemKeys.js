import {
  cloneDeep,
  get,
  set,
  omit,
  uniqueId,
} from 'lodash';

import { FIELD_ARRAY_ITEM_IDENTIFIER_KEY } from '../../constants';

/** A factory that returns a function that applies the passed handler to each defined field array in the values object.
 *
 * @param {function} handler
 * @returns
 */
const buildHandler = (handler) => (values, fieldArrays) => {
  if (!fieldArrays?.length) return values;

  const clonedValues = cloneDeep(values);

  fieldArrays.forEach((name) => {
    const processedValues = get(clonedValues, name)?.map(handler);

    set(clonedValues, name, processedValues);
  });

  return clonedValues;
};

/**
 * Populates the elements of each passed field array in the values object with a unique identifier for correct manipulation in dynamic form.
 *
 * Unique identifiers should generally be cleared before submitting the form.
 *
 * The opposite of `omitUniqueFieldArrayItemKeys` function.
 *
 * @param {object} initialValues - initial entity's values
 * @param {string[]} fieldArrays - a list of field arrays' names
 */
export const injectUniqueFieldArrayItemKeys = buildHandler(item => ({
  [FIELD_ARRAY_ITEM_IDENTIFIER_KEY]: uniqueId(FIELD_ARRAY_ITEM_IDENTIFIER_KEY),
  ...item,
}));

/**
 * Clears the elements of each passed array of fields in the values object of unique identifiers for subsequent form processing.
 *
 * The opposite of `injectUniqueFieldArrayItemKeys` function.
 *
 * @param {object} values - initial entity's values
 * @param {string[]} fieldArrays - a list of field arrays' names
 */
export const omitUniqueFieldArrayItemKeys = buildHandler(item => omit(item, FIELD_ARRAY_ITEM_IDENTIFIER_KEY));
