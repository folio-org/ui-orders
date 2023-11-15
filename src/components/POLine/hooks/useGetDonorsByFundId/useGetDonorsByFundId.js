import {
  get,
  keyBy,
  uniq,
} from 'lodash';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';

export const useGetDonorsByFundId = ({
  funds,
  fundDistribution,
  initialDonorOrganizationIds,
}) => {
  const [donorIds, setDonorIds] = useState(initialDonorOrganizationIds);
  const [excludedIds, setExcludedIds] = useState([]);

  const fundRecordsMap = useMemo(() => keyBy(funds, 'id'), [funds]);
  const fundIds = useMemo(() => {
    return fundDistribution?.map(({ fundId }) => fundId).filter(Boolean);
  }, [fundDistribution]);

  const donorOrganizationIds = useMemo(() => {
    return fundIds?.reduce((acc, fundId) => {
      const fund = fundRecordsMap[fundId];
      const fundDonorIds = get(fund, 'donorOrganizationIds', []).filter(donorId => !excludedIds.includes(donorId));

      return [...acc, ...fundDonorIds];
    }, []);
  }, [excludedIds, fundIds, fundRecordsMap]);

  const onDonorRemove = (removedId) => {
    setExcludedIds(prevExcludedIds => [...prevExcludedIds, removedId]);
    setDonorIds(prevState => prevState.filter(donorId => donorId !== removedId));
  };

  useEffect(() => {
    setDonorIds(prevDonorIds => [...prevDonorIds, ...donorOrganizationIds]);
  }, [donorOrganizationIds]);

  return {
    donorOrganizationIds: uniq(donorIds),
    setDonorIds,
    onDonorRemove,
  };
};
