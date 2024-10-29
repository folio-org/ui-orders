import {
  useCentralOrderingContext,
  useTenantHoldingsAndLocations,
  useLocationsQuery,
  useReceivingTenantIdsAndLocations,
} from '@folio/stripes-acq-components';
import { useStripes } from '@folio/stripes/core';

const DEFAULT_DATA = [];

export const useLocationsAndHoldingsByTenants = ({ receivingTenantIdsByLocations = DEFAULT_DATA, instanceId }) => {
  const stripes = useStripes();
  const currentTenantId = stripes?.okapi?.tenant;

  const { isCentralOrderingEnabled } = useCentralOrderingContext();

  const {
    isLoading: isLocationsLoading,
    locations = DEFAULT_DATA,
  } = useLocationsQuery({ consortium: isCentralOrderingEnabled });

  const { receivingTenantIds } = useReceivingTenantIdsAndLocations({
    receivingTenantIds: receivingTenantIdsByLocations,
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

  const _poLineLocations = instanceId ? holdingLocations : locations;

  return {
    holdings,
    locations: _poLineLocations,
    isLoading: isLocationsLoading || isHoldingLocationsLoading,
  };
};
