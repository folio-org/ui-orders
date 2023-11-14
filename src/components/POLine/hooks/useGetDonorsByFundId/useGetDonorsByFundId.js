import { get, keyBy, uniq } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

export const useGetDonorsByFundId = ({ funds, fundDistribution, initialDonorOrganizationIds }) => {
  const [donorIds, setDonorIds] = useState(initialDonorOrganizationIds);
  const fundRecordsMap = useMemo(() => keyBy(funds, 'id'), [funds]);
  const fundIds = useMemo(() => {
    return fundDistribution?.map(({ fundId }) => fundId).filter(Boolean);
  }, [fundDistribution]);

  const donorOrganizationIds = useMemo(() => {
    return fundIds.reduce((acc, fundId) => {
      const fund = fundRecordsMap[fundId];
      const fundDonorIds = get(fund, 'donorOrganizationIds', []);

      return [...acc, ...fundDonorIds];
    }, []);
  }, [fundIds, fundRecordsMap]);

  useEffect(() => {
    setDonorIds(prevDonorIds => [...prevDonorIds, ...donorOrganizationIds]);
  }, [donorOrganizationIds]);

  return {
    donorOrganizationIds: uniq(donorIds),
    setDonorIds,
  };
};
