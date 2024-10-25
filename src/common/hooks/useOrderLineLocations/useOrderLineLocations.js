import { useMemo } from 'react';

import {
  useCentralOrderingContext,
  useHoldingsAndLocations,
  useLocationsQuery,
  useReceivingTenantIdsAndLocations,
} from '@folio/stripes-acq-components';
import { useStripes } from '@folio/stripes/core';

const DEFAULT_DATA = [];

export const useOrderLineLocations = ({ poLineLocations = DEFAULT_DATA, instanceId }) => {
  const stripes = useStripes();
  const currentTenantId = stripes?.okapi?.tenant;

  const { isCentralOrderingEnabled } = useCentralOrderingContext();

  const {
    isLoading: isLocationsLoading,
    locations = DEFAULT_DATA,
  } = useLocationsQuery({ consortium: isCentralOrderingEnabled });

  const receivingTenants = useMemo(() => {
    if (poLineLocations.length) {
      return poLineLocations.map(({ tenantId }) => tenantId);
    }

    return [];
  }, [poLineLocations]);

  const { receivingTenantIds } = useReceivingTenantIdsAndLocations({
    receivingTenantIds: receivingTenants,
    currentReceivingTenantId: currentTenantId,
  });

  const {
    holdings,
    locations: holdingLocations = DEFAULT_DATA,
    isLoading: isHoldingLocationsLoading,
  } = useHoldingsAndLocations({
    instanceId,
    receivingTenantIds,
    tenantId: currentTenantId,
  });

  const _poLineLocations = instanceId ? holdingLocations : locations;

  return {
    holdings,
    locations: _poLineLocations,
    isLoading: isLocationsLoading || isHoldingLocationsLoading,
  };
};
