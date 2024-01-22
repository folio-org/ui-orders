import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useFundsById } from '../useFundsById';
import { useGetLocationsByHoldingIds } from '../useGetLocationsByHoldingIds';

export const useFundsWithRestrictedLocationsById = ({
  fundIDs = [],
  locationIDs = [],
  holdingIds = [],
}) => {
  const [hasLocationRestrictedFund, setHasLocationRestrictedFund] = useState(false);

  const {
    isLoading: isLocationLoading,
    locationIds: permanentLocationId,
  } = useGetLocationsByHoldingIds(holdingIds);

  const listOfLocationIDs = useMemo(() => [...locationIDs, ...permanentLocationId], [locationIDs, permanentLocationId]);

  const { funds, isLoading: isFundsLoading } = useFundsById(fundIDs, {
    enabled: Boolean(fundIDs.length && !isLocationLoading),
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
