import { get } from 'lodash';

import { validateFundDistribution } from '@folio/stripes-acq-components';

import calculateEstimatedPrice from './calculateEstimatedPrice';

function validate(values, { stripes }) {
  const errors = {};
  const currency = get(values, 'cost.currency') || stripes.currency;
  const totalAmount = calculateEstimatedPrice(values, stripes.currency);
  const fundDistributionErrors = validateFundDistribution(values.fundDistribution, totalAmount, currency);

  if (fundDistributionErrors) errors.fundDistribution = fundDistributionErrors;

  return errors;
}

export default validate;
