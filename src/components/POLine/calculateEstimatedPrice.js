import { get } from 'lodash';

import { DISCOUNT_TYPE } from './const';

const calculateEstimatedPrice = (formValues) => {
  const listUnitPrice = get(formValues, 'cost.listUnitPrice') || 0;
  const quantityPhysical = get(formValues, 'cost.quantityPhysical') || 0;
  const quantityElectronic = get(formValues, 'cost.quantityElectronic') || 0;
  const additionalCost = get(formValues, 'cost.additionalCost') || 0;
  const listUnitPriceElectronic = get(formValues, 'cost.listUnitPriceElectronic') || 0;
  const discount = get(formValues, 'cost.discount') || 0;
  const baseListPrice = (listUnitPrice * quantityPhysical) + (listUnitPriceElectronic * quantityElectronic);
  const discountType = get(formValues, 'cost.discountType', DISCOUNT_TYPE.amount) || DISCOUNT_TYPE.amount;
  const isAmountDiscountType = discountType === DISCOUNT_TYPE.amount;
  const discountAmount = isAmountDiscountType ? discount : baseListPrice * discount / 100;
  const poLineEstimatedPrice = baseListPrice + additionalCost - discountAmount;

  return poLineEstimatedPrice;
};

export default calculateEstimatedPrice;
