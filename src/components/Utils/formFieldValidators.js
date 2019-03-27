import React from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

export const combineValidators = (validators) => (...args) => validators
  .map(item => item(...args))
  .find(item => item);

const reduceLocations = (locations, propName) => {
  const reducer = (accumulator, d) => accumulator + (d[propName] || 0);

  return locations.reduce(reducer, 0);
};

export const positiveNumbers = value => (value && value < 0
  ? <FormattedMessage id="ui-orders.cost.validation.shouldBePositive" />
  : undefined);

export const locationQuantityMatchToDetails = (poType) => (value, { cost, locations = [] }) => {
  const allLocationsQuantity = reduceLocations(locations, poType);
  const overallLineQuantity = get(cost, poType, 0);

  return allLocationsQuantity <= overallLineQuantity
    ? undefined
    : <FormattedMessage id={`ui-orders.location.${poType}.not.match`} />;
};
