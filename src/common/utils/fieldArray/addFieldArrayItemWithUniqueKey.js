import uniqueId from 'lodash/uniqueId';

import { FIELD_ARRAY_ITEM_IDENTIFIER_KEY } from '../../constants';

export const addFieldArrayItemWithUniqueKey = (fields) => (
  fields.push({ [FIELD_ARRAY_ITEM_IDENTIFIER_KEY]: uniqueId(FIELD_ARRAY_ITEM_IDENTIFIER_KEY) })
);
