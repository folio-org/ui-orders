import React from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { validateRequired } from '@folio/stripes-acq-components';

import {
  ERESOURCES,
  INVENTORY_RECORDS_TYPE,
  OTHER,
  PHRESOURCES,
} from '../../../components/POLine/const';

export const REQUIRED_LOCATION_QUANTITY_MAP_TO_INVENTORY = {
  [INVENTORY_RECORDS_TYPE.all]: true,
  [INVENTORY_RECORDS_TYPE.instance]: false,
  [INVENTORY_RECORDS_TYPE.instanceAndHolding]: true,
  [INVENTORY_RECORDS_TYPE.none]: false,
};

export const isLocationPhysicalQuantityRequired = (orderFormat, inventory) => {
  return [...PHRESOURCES, OTHER].includes(orderFormat)
    ? REQUIRED_LOCATION_QUANTITY_MAP_TO_INVENTORY[inventory]
    : false;
};

export const isLocationEresourceQuantityRequired = (orderFormat, inventory) => {
  return ERESOURCES.includes(orderFormat)
    ? REQUIRED_LOCATION_QUANTITY_MAP_TO_INVENTORY[inventory]
    : false;
};

const LOCATION_MUST_BE_SPECIFIED = 'required';

const getTotalLocationsQuantities = (locations, propName) => {
  const reducer = (accumulator, d) => accumulator + (d[propName] || 0);

  return locations.reduce(reducer, 0);
};

export const validateNotNegative = value => {
  return value < 0
    ? <FormattedMessage id="ui-orders.validation.quantity.canNotBeLess0" />
    : undefined;
};

export const validateQuantityPhysical = (value, { cost, locations = [], physical, orderFormat }) => {
  const validateNotNegativeMessage = validateNotNegative(value);

  if (validateNotNegativeMessage) return validateNotNegativeMessage;

  const allLocationsQuantity = getTotalLocationsQuantities(locations, 'quantityPhysical');
  const overallLineQuantity = Number(get(cost, 'quantityPhysical', 0));
  const inventoryType = get(physical, 'createInventory', '');
  const isQuantityRequired = isLocationPhysicalQuantityRequired(orderFormat, inventoryType);

  if (isQuantityRequired) {
    return allLocationsQuantity !== overallLineQuantity
      ? <FormattedMessage id="ui-orders.location.quantityPhysical.notMatch" />
      : undefined;
  } else {
    return value && value !== 0 && allLocationsQuantity !== overallLineQuantity
      ? <FormattedMessage id="ui-orders.location.quantityPhysical.notMatchOrEmpty" />
      : undefined;
  }
};

export const validateQuantityElectronic = (value, { cost, locations = [], eresource, orderFormat }) => {
  const validateNotNegativeMessage = validateNotNegative(value);

  if (validateNotNegativeMessage) return validateNotNegativeMessage;

  const allLocationsQuantity = getTotalLocationsQuantities(locations, 'quantityElectronic');
  const overallLineQuantity = Number(get(cost, 'quantityElectronic', 0));
  const inventoryType = get(eresource, 'createInventory', '');
  const isQuantityRequired = isLocationEresourceQuantityRequired(orderFormat, inventoryType);

  if (isQuantityRequired) {
    return allLocationsQuantity !== overallLineQuantity
      ? <FormattedMessage id="ui-orders.location.quantityElectronic.notMatch" />
      : undefined;
  } else {
    return value && value !== 0 && allLocationsQuantity !== overallLineQuantity
      ? <FormattedMessage id="ui-orders.location.quantityElectronic.notMatchOrEmpty" />
      : undefined;
  }
};

export const parseQuantity = (value) => {
  return value
    ? Number(value)
    : 0;
};

export const isLocationsRequired = (values, valuesAll) => {
  const orderFormat = get(valuesAll, 'orderFormat');
  const physicalInventory = get(valuesAll, 'physical.createInventory', '');
  const eresourceInventory = get(valuesAll, 'eresource.createInventory', '');
  const isPhysicalQuantityRequired = isLocationPhysicalQuantityRequired(orderFormat, physicalInventory);
  const isElectronicQuantityRequired = isLocationEresourceQuantityRequired(orderFormat, eresourceInventory);
  const isLocationRequired = (isPhysicalQuantityRequired || isElectronicQuantityRequired) && !values.length;

  return isLocationRequired
    ? LOCATION_MUST_BE_SPECIFIED
    : undefined;
};

export const validateLocation = (value, { locations }) => {
  const validateRequiredMessage = validateRequired(value);

  if (validateRequiredMessage) return validateRequiredMessage;

  const { quantityPhysical, quantityElectronic } = locations.find(({ locationId }) => locationId === value);
  const isQuantitiesNeed =
    (!quantityPhysical || quantityPhysical === 0) && (!quantityElectronic || quantityElectronic === 0);

  return isQuantitiesNeed
    ? <FormattedMessage id="ui-orders.location.emptyQuantities" />
    : undefined;
};
