import { get } from 'lodash';

import { validateFundDistributionFinal } from '@folio/stripes-acq-components';

import calculateEstimatedPrice from './calculateEstimatedPrice';

function validate(fundDistribution, formValues) {
  const currency = get(formValues, 'cost.currency');
  const totalAmount = calculateEstimatedPrice(formValues);

  return validateFundDistributionFinal(fundDistribution, totalAmount, currency);
}

export default validate;
