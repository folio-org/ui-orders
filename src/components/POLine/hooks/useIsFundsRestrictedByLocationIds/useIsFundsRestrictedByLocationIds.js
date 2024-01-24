import { uniq } from 'lodash';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useFundsById } from '../useFundsById';
import { useLocationsByHoldingIds } from '../useLocationsByHoldingIds';

export const useIsFundsRestrictedByLocationIds = ({
  fundIds = [],
  locationIds: locationIdsProp = [],
  holdingIds = [],
}) => {
  const [hasLocationRestrictedFund, setHasLocationRestrictedFund] = useState(false);

  const {
    isLoading: isLocationLoading,
    permanentLocationId,
  } = useLocationsByHoldingIds(holdingIds);

  const listOfLocationIDs = useMemo(() => {
    return uniq([...locationIdsProp, permanentLocationId]);
  }, [locationIdsProp, permanentLocationId]);

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

  useEffect(() => {
    if (fundsWithRestrictedLocations.length) {
      const fundRestricted = !isFundNotRestricted();

      setHasLocationRestrictedFund(fundRestricted);
    }
  }, [fundsWithRestrictedLocations, hasLocationRestrictedFund, isFundNotRestricted]);

  return ({
    isLoading: isLocationLoading || isFundsLoading,
    hasLocationRestrictedFund,
  });
};
