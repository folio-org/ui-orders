import get from 'lodash/get';
import {
  useCallback,
  useMemo,
} from 'react';

import {
  useCentralOrderingContext,
  useInstanceHoldingsQuery,
} from '@folio/stripes-acq-components';

import { useFundsById } from '../useFundsById';

export const useIsFundsRestrictedByLocationIds = (line) => {
  const { isCentralOrderingEnabled } = useCentralOrderingContext();

  const {
    fundIds,
    holdingIds,
    locationIds: locationIdsProp,
  } = useMemo(() => {
    return {
      fundIds: get(line, 'fundDistribution', []).map(({ fundId }) => fundId),
      holdingIds: get(line, 'locations', []).map(({ holdingId }) => holdingId).filter(Boolean),
      locationIds: get(line, 'locations', []).map(({ locationId }) => locationId).filter(Boolean),
    };
  }, [line]);

  const {
    isLoading: isHoldingsLoading,
    holdings,
  } = useInstanceHoldingsQuery(line?.instanceId, { consortium: isCentralOrderingEnabled });

  const locationIdsSet = useMemo(() => {
    const holdingIdsSet = new Set(holdingIds);
    const permanentLocationIds = holdings
      .filter(({ id }) => holdingIdsSet.has(id))
      .map(({ permanentLocationId }) => permanentLocationId);

    return new Set([...locationIdsProp, ...permanentLocationIds]);
  }, [holdings, locationIdsProp]);

  const { funds, isLoading: isFundsLoading } = useFundsById(fundIds, {
    enabled: !isHoldingsLoading,
  });

  const locationsRestrictedByFunds = useMemo(() => {
    return funds
      .filter(({ restrictByLocations }) => restrictByLocations)
      .map(({ locations }) => locations.map(({ locationId }) => locationId));
  }, [funds]);

  const isFundNotRestricted = useCallback(() => {
    return locationsRestrictedByFunds.every((locationIds) => {
      return locationIds.some((locationId) => locationIdsSet.has(locationId));
    });
  }, [locationsRestrictedByFunds, locationIdsSet]);

  const hasLocationRestrictedFund = useMemo(() => {
    if (!isHoldingsLoading && !isFundsLoading && locationsRestrictedByFunds.length) {
      return !isFundNotRestricted();
    }

    return false;
  }, [locationsRestrictedByFunds, isFundNotRestricted, isFundsLoading, isHoldingsLoading]);

  return ({
    isLoading: isHoldingsLoading || isFundsLoading,
    hasLocationRestrictedFund,
  });
};
