import { uniq } from 'lodash';
import {
  useCallback,
  useMemo,
} from 'react';

import { useFundsById } from '../useFundsById';
import { useLocationsByHoldingIds } from '../useLocationsByHoldingIds';

export const useIsFundsRestrictedByLocationIds = ({
  fundIds = [],
  locationIds: locationIdsProp = [],
  holdingIds = [],
}) => {
  const {
    isLoading: isLocationLoading,
    permanentLocationIds,
  } = useLocationsByHoldingIds(holdingIds);

  const listOfLocationIDs = useMemo(() => {
    return uniq([...locationIdsProp, ...permanentLocationIds]);
  }, [locationIdsProp, permanentLocationIds]);

  const { funds, isLoading: isFundsLoading } = useFundsById(fundIds, {
    enabled: !isLocationLoading,
  });

  const fundsWithRestrictedLocations = useMemo(() => {
    return funds
      .filter(({ restrictByLocations }) => restrictByLocations)
      .map(({ locationIds, id }) => ({ id, locationIds }));
  }, [funds]);

  const isFundNotRestricted = useCallback(() => {
    return listOfLocationIDs.some((locationId) => {
      return fundsWithRestrictedLocations.some(({ locationIds }) => locationIds.includes(locationId));
    });
  }, [fundsWithRestrictedLocations, listOfLocationIDs]);

  const hasLocationRestrictedFund = useMemo(() => {
    return fundsWithRestrictedLocations.length
      ? !isFundNotRestricted()
      : false;
  }, [fundsWithRestrictedLocations.length, isFundNotRestricted]);

  return ({
    isLoading: isLocationLoading || isFundsLoading,
    hasLocationRestrictedFund,
  });
};
