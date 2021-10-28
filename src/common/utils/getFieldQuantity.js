import { get } from 'lodash';

import {
  isEresource,
  isPhresource,
  isOtherResource,
} from '../POLFields';

export const getFieldQuantity = (initialValues, fieldName) => {
  const initialQuantity = get(initialValues, fieldName);

  if (initialQuantity) return initialQuantity;

  const orderFormat = get(initialValues, 'orderFormat');
  const fieldFormat = fieldName
    .match(/quantity(Physical|Electronic)/i)[1]
    .toLowerCase();

  const isIncludeFormat = {
    physical: isPhresource(orderFormat) || isOtherResource(orderFormat),
    electronic: isEresource(orderFormat),
  };

  if (isIncludeFormat[fieldFormat]) return 0;

  return null;
};
