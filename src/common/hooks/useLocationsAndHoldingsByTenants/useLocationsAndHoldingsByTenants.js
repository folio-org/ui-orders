import {
  useCentralOrderingContext,
  useTenantHoldingsAndLocations,
  useLocationsQuery,
  useReceivingTenantIdsAndLocations,
} from '@folio/stripes-acq-components';
import { useStripes } from '@folio/stripes/core';

const DEFAULT_DATA = [];

export const useLocationsAndHoldingsByTenants = ({ tenantIds = DEFAULT_DATA, instanceId }) => {
  const stripes = useStripes();
  const currentTenantId = stripes?.okapi?.tenant;

  const { isCentralOrderingEnabled } = useCentralOrderingContext();

  const {
    isLoading: isLocationsLoading,
    locations = DEFAULT_DATA,
  } = useLocationsQuery({ consortium: isCentralOrderingEnabled });

  const { receivingTenantIds } = useReceivingTenantIdsAndLocations({
    receivingTenantIds: tenantIds,
    currentReceivingTenantId: currentTenantId,
  });

  const {
    holdings,
    locations: holdingLocations = DEFAULT_DATA,
    isLoading: isHoldingLocationsLoading,
  } = useTenantHoldingsAndLocations({
    instanceId,
    receivingTenantIds,
    tenantId: currentTenantId,
  });

  return {
    holdings,
    locations: instanceId ? holdingLocations : locations,
    isLoading: isLocationsLoading || isHoldingLocationsLoading,
  };
};
