import { uniq } from 'lodash';
import {
  useCallback,
  useMemo,
} from 'react';

import { useHoldingsByIds } from '../../../../common/hooks';
import { useFundsById } from '../useFundsById';

export const useIsFundsRestrictedByLocationIds = ({
  fundIds = [],
  locationIds: locationIdsProp = [],
  holdingIds = [],
}) => {
  const {
    isLoading: isHoldingsLoading,
    holdings,
  } = useHoldingsByIds(holdingIds);

  const listOfLocationIds = useMemo(() => {
    const permanentLocationIds = holdings.map(({ permanentLocationId }) => permanentLocationId);

    return uniq([...locationIdsProp, ...permanentLocationIds]);
  }, [holdings, locationIdsProp]);

  const { funds, isLoading: isFundsLoading } = useFundsById(fundIds, {
    enabled: !isHoldingsLoading,
  });

  const fundsWithRestrictedLocations = useMemo(() => {
    return funds
      .filter(({ restrictByLocations }) => restrictByLocations)
      .map(({ locationIds }) => locationIds);
  }, [funds]);

  const isFundNotRestricted = useCallback(() => {
    return fundsWithRestrictedLocations
      .every((locationIds) => locationIds.some((locationId) => listOfLocationIds.includes(locationId)));
  }, [fundsWithRestrictedLocations, listOfLocationIds]);

  const hasLocationRestrictedFund = useMemo(() => {
    if (!isHoldingsLoading && !isFundsLoading && fundsWithRestrictedLocations.length) {
      return !isFundNotRestricted();
    }

    return false;
  }, [fundsWithRestrictedLocations, isFundNotRestricted, isFundsLoading, isHoldingsLoading]);

  return ({
    isLoading: isHoldingsLoading || isFundsLoading,
    hasLocationRestrictedFund,
  });
};
