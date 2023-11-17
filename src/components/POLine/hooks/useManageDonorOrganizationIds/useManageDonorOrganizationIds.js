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

export const useManageDonorOrganizationIds = ({
  funds,
  fundDistribution,
  initialDonorOrganizationIds,
}) => {
  const [donorIds, setDonorIds] = useState(initialDonorOrganizationIds);
  /*
    excludedIds are the list of donor ids that are removed.
    The purpose of this list is to prevent the same ids being added automatically when fundDistribution changes.
  */
  const [excludedIds, setExcludedIds] = useState([]);

  const fundRecordsMap = useMemo(() => keyBy(funds, 'id'), [funds]);
  const fundIds = useMemo(() => {
    return fundDistribution?.map(({ fundId }) => fundId).filter(Boolean);
  }, [fundDistribution]);

  const donorOrganizationIds = useMemo(() => {
    return fundIds?.reduce((acc, fundId) => {
      const fund = fundRecordsMap[fundId];
      // Donor ids that are already removed(excludedIds) should not be added again.
      const fundDonorIds = get(fund, 'donorOrganizationIds', []).filter(donorId => !excludedIds.includes(donorId));

      return acc.concat(fundDonorIds);
    }, []);
  }, [excludedIds, fundIds, fundRecordsMap]);

  const onDonorRemove = (removedId) => {
    setExcludedIds(prevExcludedIds => [...prevExcludedIds, removedId]);
    setDonorIds(prevState => uniq(prevState.filter(donorId => donorId !== removedId)));
  };

  useEffect(() => {
    if (donorOrganizationIds.length) {
      setDonorIds(prevDonorIds => uniq([...prevDonorIds, ...donorOrganizationIds]));
    }
  }, [donorOrganizationIds]);

  return {
    donorOrganizationIds: donorIds,
    setDonorIds,
    onDonorRemove,
  };
};
