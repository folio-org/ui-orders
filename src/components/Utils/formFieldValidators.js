import React from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

const getTotalLocationsQuantity = (locations, propName) => {
  const reducer = (accumulator, d) => accumulator + (d[propName] || 0);

  return locations.reduce(reducer, 0);
};

// Validation for Fields with type 'number' requires positive integer
export const validateRequiredPositiveQuantity = value => ((parseFloat(value) && value < 1) || !value
  ? <FormattedMessage id="ui-orders.cost.validation.shouldBePositive" />
  : undefined);

export const validateRequiredNotNegative = (value) => {
  return value === 0 || value > 0
    ? undefined
    : <FormattedMessage id="ui-orders.cost.validation.cantBeNegativeOrEmpty" />;
};

export const validateLocationQuantityMatchToDetails = (poType) => (value, { cost, locations = [] }) => {
  const allLocationsQuantity = getTotalLocationsQuantity(locations, poType);
  const overallLineQuantity = get(cost, poType, 0);

  return allLocationsQuantity <= overallLineQuantity
    ? undefined
    : <FormattedMessage id={`ui-orders.location.${poType}.notMatch`} />;
};

export const validateNotNegative = (value) => {
  return !value || value > 0
    ? undefined
    : <FormattedMessage id="ui-orders.cost.validation.cantBeNegative" />;
};
