import { get } from 'lodash';

import { getMoneyMultiplier } from '@folio/stripes-acq-components';

import { DISCOUNT_TYPE } from './const';

const calculateEstimatedPrice = (formValues, systemCurrency) => {
  const currency = get(formValues, 'cost.currency') || systemCurrency;
  const multiplier = getMoneyMultiplier(currency);
  const listUnitPrice = Number(get(formValues, 'cost.listUnitPrice') || 0) * multiplier;
  const quantityPhysical = get(formValues, 'cost.quantityPhysical') || 0;
  const quantityElectronic = get(formValues, 'cost.quantityElectronic') || 0;
  const additionalCost = Number(get(formValues, 'cost.additionalCost') || 0) * multiplier;
  const listUnitPriceElectronic = Number(get(formValues, 'cost.listUnitPriceElectronic') || 0) * multiplier;
  const discount = Number(get(formValues, 'cost.discount') || 0);
  const baseListPrice = (listUnitPrice * quantityPhysical) + (listUnitPriceElectronic * quantityElectronic);
  const discountType = get(formValues, 'cost.discountType', DISCOUNT_TYPE.amount) || DISCOUNT_TYPE.amount;
  const isAmountDiscountType = discountType === DISCOUNT_TYPE.amount;
  const discountAmount = isAmountDiscountType
    ? discount * multiplier
    : Math.round(baseListPrice * discount * 100) / 10000;
  const poLineEstimatedPrice = Math.round(baseListPrice + additionalCost - discountAmount) / multiplier;

  return poLineEstimatedPrice;
};

export default calculateEstimatedPrice;
