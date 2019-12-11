import { get } from 'lodash';

import { validateFundDistribution } from '@folio/stripes-acq-components';

import calculateEstimatedPrice from './calculateEstimatedPrice';

function validate(values, { stripes }) {
  const errors = {};
  const currency = get(values, 'currency') || stripes.currency;
  const totalAmount = calculateEstimatedPrice(values, stripes);
  const fundDistributionErrors = validateFundDistribution(values.fundDistribution, totalAmount, stripes, currency);

  if (fundDistributionErrors) errors.fundDistribution = fundDistributionErrors;

  return errors;
}

export default validate;
