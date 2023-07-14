import { FIELD_ARRAY_ITEM_IDENTIFIER_KEY } from '../../constants';

export const getFieldUniqueKey = (_, index, fields) => (
  fields?.value?.[index]?.[FIELD_ARRAY_ITEM_IDENTIFIER_KEY] || index
);
