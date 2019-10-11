import { validateFundDistribution } from '@folio/stripes-acq-components';

function validate(values) {
  const errors = {};
  const fundDistributionErrors = validateFundDistribution(values.fundDistribution);

  if (fundDistributionErrors) errors.fundDistribution = fundDistributionErrors;

  return errors;
}

export default validate;
