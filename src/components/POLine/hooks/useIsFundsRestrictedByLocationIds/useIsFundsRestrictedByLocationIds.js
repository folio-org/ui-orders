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
    return listOfLocationIds.some((locationId) => {
      return fundsWithRestrictedLocations.some((locationIds) => locationIds.includes(locationId));
    });
  }, [fundsWithRestrictedLocations, listOfLocationIds]);

  const hasLocationRestrictedFund = useMemo(() => {
    return fundsWithRestrictedLocations.length
      ? !isFundNotRestricted()
      : false;
  }, [fundsWithRestrictedLocations.length, isFundNotRestricted]);

  return ({
    isLoading: isHoldingsLoading || isFundsLoading,
    hasLocationRestrictedFund,
  });
};
