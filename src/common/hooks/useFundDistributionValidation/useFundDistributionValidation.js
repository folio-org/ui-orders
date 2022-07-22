import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { VALIDATE_PO_LINE_FUND_DISTRIBUTION_API } from '../../constants';

export const useFundDistributionValidation = ({ cost }) => {
  const ky = useOkapiKy();

  const mutationFn = (fundDistribution = []) => {
    return ky.put(VALIDATE_PO_LINE_FUND_DISTRIBUTION_API, {
      json: {
        cost,
        fundDistribution,
      },
    });
  };

  const { mutateAsync, isLoading } = useMutation({
    mutationFn,
    enabled: Boolean(cost),
  });

  return {
    isLoading,
    validateFundDistributionTotal: mutateAsync,
  };
};
