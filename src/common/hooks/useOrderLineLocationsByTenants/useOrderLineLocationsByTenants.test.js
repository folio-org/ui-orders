import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import {
  useTenantHoldingsAndLocations,
  useLocationsQuery,
} from '@folio/stripes-acq-components';

import { useOrderLineLocationsByTenants } from './useOrderLineLocationsByTenants';

jest.mock('@folio/stripes-acq-components', () => ({
  useCentralOrderingContext: jest.fn(() => ({ isCentralOrderingEnabled: false })),
  useTenantHoldingsAndLocations: jest.fn().mockReturnValue({
    holdings: [],
    locations: [],
    isLoading: false,
  }),
  useLocationsQuery: jest.fn().mockReturnValue({ locations: [] }),
  useReceivingTenantIdsAndLocations: jest.fn().mockReturnValue({
    receivingTenantIds: [],
    additionalLocationIds: [],
  }),
}));
jest.mock('@folio/stripes/core', () => ({
  useStripes: jest.fn().mockReturnValue({ okapi: { tenant: 'tenantId' } }),
}));

describe('useOrderLineLocations', () => {
  it('should return holdings, locations and isLoading', () => {
    const { result } = renderHook(() => useOrderLineLocationsByTenants({ poLineLocations: [{ tenantId: 'tenantId' }] }));

    expect(result.current).toEqual({
      holdings: [],
      locations: [],
      isLoading: false,
    });
  });

  it('should return locations from holding if instanceId is provided', () => {
    useTenantHoldingsAndLocations.mockReturnValue({
      holdings: [{ id: 'holdingId' }],
      locations: [{ id: 'locationId' }],
      isLoading: false,
    });

    const { result } = renderHook(() => useOrderLineLocationsByTenants({ instanceId: 'instanceId' }));

    expect(result.current).toEqual({
      holdings: [{ id: 'holdingId' }],
      locations: [{ id: 'locationId' }],
      isLoading: false,
    });
  });

  it('should return locations from locations if instanceId is not provided', () => {
    useLocationsQuery.mockReturnValue({
      locations: [{ id: 'locationId' }],
      isLoading: false,
    });

    const { result } = renderHook(() => useOrderLineLocationsByTenants({}));

    expect(result.current).toEqual({
      holdings: [{ 'id': 'holdingId' }],
      locations: [{ id: 'locationId' }],
      isLoading: false,
    });
  });
});
