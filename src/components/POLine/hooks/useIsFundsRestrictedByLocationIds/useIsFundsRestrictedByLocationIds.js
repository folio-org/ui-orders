/* eslint-disable no-shadow */
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
  locationIds = [],
  holdingIds = [],
}) => {
  const [hasLocationRestrictedFund, setHasLocationRestrictedFund] = useState(false);

  const {
    isLoading: isLocationLoading,
    locationIds: permanentLocationId,
  } = useLocationsByHoldingIds(holdingIds);

  const listOfLocationIDs = useMemo(() => [...locationIds, ...permanentLocationId], [locationIds, permanentLocationId]);

  const { funds, isLoading: isFundsLoading } = useFundsById(fundIds, {
    enabled: !isLocationLoading,
  });

  const fundWithRestrictedLocations = useMemo(() => {
    return funds
      .filter(({ restrictByLocations }) => restrictByLocations)
      .map(({ locationIds, id }) => ({ id, locationIds }));
  }, [funds]);

  const isFundNotRestricted = useCallback(() => {
    return listOfLocationIDs.some((locationId) => {
      return fundWithRestrictedLocations.some(({ locationIds }) => locationIds.includes(locationId));
    });
  }, [fundWithRestrictedLocations, listOfLocationIDs]);

  useEffect(() => {
    if (fundWithRestrictedLocations.length) {
      const fundRestricted = !isFundNotRestricted();

      setHasLocationRestrictedFund(fundRestricted);
    }
  }, [fundWithRestrictedLocations, hasLocationRestrictedFund, isFundNotRestricted]);

  return ({
    isLoading: isLocationLoading || isFundsLoading,
    hasLocationRestrictedFund,
  });
};
