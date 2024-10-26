import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import {
  useHoldingsAndLocations,
  useLocationsQuery,
} from '@folio/stripes-acq-components';

import { useOrderLineLocations } from './useOrderLineLocations';

jest.mock('@folio/stripes-acq-components', () => ({
  useCentralOrderingContext: jest.fn(() => ({ isCentralOrderingEnabled: false })),
  useHoldingsAndLocations: jest.fn().mockReturnValue({
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
    const { result } = renderHook(() => useOrderLineLocations({ poLineLocations: [{ tenantId: 'tenantId' }] }));

    expect(result.current).toEqual({
      holdings: [],
      locations: [],
      isLoading: false,
    });
  });

  it('should return locations from holding if instanceId is provided', () => {
    useHoldingsAndLocations.mockReturnValue({
      holdings: [{ id: 'holdingId' }],
      locations: [{ id: 'locationId' }],
      isLoading: false,
    });

    const { result } = renderHook(() => useOrderLineLocations({ instanceId: 'instanceId' }));

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

    const { result } = renderHook(() => useOrderLineLocations({}));

    expect(result.current).toEqual({
      holdings: [{ 'id': 'holdingId' }],
      locations: [{ id: 'locationId' }],
      isLoading: false,
    });
  });
});
