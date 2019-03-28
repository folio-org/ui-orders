import React from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

export const validateNotNegative = (value) => {
  return !value || value > 0
    ? undefined
    : <FormattedMessage id="ui-orders.cost.validation.cantBeNegative" />;
};

// Validation for Fields with type 'number' requires positive integer
export const requiredPositiveQuantity = (value) => {
  return value >= 1
    ? undefined
    : <FormattedMessage id="ui-orders.cost.validation.shouldBePositive" />;
};

export const validateRequiredNotNegative = (value) => {
  return value === 0 || value > 0
    ? undefined
    : <FormattedMessage id="ui-orders.cost.validation.cantBeNegativeOrEmpty" />;
};

const getTotalLocationsQuantities = (locations, propName) => {
  const reducer = (accumulator, d) => accumulator + (d[propName] || 0);

  return locations.reduce(reducer, 0);
};

export const validateQuantityPhysical = (value, { cost, locations = [] }) => {
  const allLocationsQuantity = getTotalLocationsQuantities(locations, 'quantityPhysical');
  const overallLineQuantity = get(cost, 'quantityPhysical', 0);

  return allLocationsQuantity <= overallLineQuantity
    ? undefined
    : <FormattedMessage id="ui-orders.location.quantityPhysical.exceeds" />;
};

export const validateQuantityElectronic = (value, { cost, locations = [] }) => {
  const allLocationsQuantity = getTotalLocationsQuantities(locations, 'quantityElectronic');
  const overallLineQuantity = get(cost, 'quantityElectronic', 0);

  return allLocationsQuantity <= overallLineQuantity
    ? undefined
    : <FormattedMessage id="ui-orders.location.quantityElectronic.exceeds" />;
};
