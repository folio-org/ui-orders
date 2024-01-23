import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { useFundsWithRestrictedLocationsById } from './useFundsWithRestrictedLocationsById';
import { useFundsById } from '../useFundsById';
import { useGetLocationsByHoldingIds } from '../useGetLocationsByHoldingIds';

jest.mock('../useFundsById', () => ({
  useFundsById: jest.fn(),
}));
jest.mock('../useGetLocationsByHoldingIds', () => ({
  useGetLocationsByHoldingIds: jest.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const restrictedFund = {
  'id': 'e3f68402-5570-4839-a54a-cecd5fd799e5',
  'name': 'Location restricted',
  'restrictByLocations': true,
  'locationIds': [
    '53cf956f-c1df-410b-8bea-27f712cca7c0',
    '184aae84-a5bf-4c6a-85ba-4a7c73026cd5',
  ],
};

const holdingData = {
  'id': '53cf956f-c1df-410b-8bea-27f712cca7c0',
  'permanentLocationId': restrictedFund.locationIds,
};

describe('useFundsWithRestrictedLocationsById', () => {
  beforeEach(() => {
    useFundsById
      .mockClear()
      .mockReturnValue({
        funds: [restrictedFund],
        isLoading: false,
      });
    useGetLocationsByHoldingIds
      .mockClear()
      .mockReturnValue({
        isLoading: false,
        locationIds: [],
      });
  });

  it('should return hasLocationRestrictedFund as true', async () => {
    const { result } = renderHook(() => useFundsWithRestrictedLocationsById({
      fundIDs: ['e3f68402-5570-4839-a54a-cecd5fd799e5'],
      locationIDs: ['testId'],
      holdingIDs: [],
    }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.hasLocationRestrictedFund).toBe(true);
  });

  it('should return hasLocationRestrictedFund as false', async () => {
    const { result } = renderHook(() => useFundsWithRestrictedLocationsById({
      fundIDs: ['e3f68402-5570-4839-a54a-cecd5fd799e5'],
      locationIDs: restrictedFund.locationIds,
      holdingIDs: [],
    }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.hasLocationRestrictedFund).toBe(false);
  });

  it('should return hasLocationRestrictedFund as false with holdingIDs', async () => {
    useGetLocationsByHoldingIds.mockClear().mockReturnValue({
      isLoading: false,
      locationIds: holdingData.permanentLocationId,
    });

    const { result } = renderHook(() => useFundsWithRestrictedLocationsById({
      fundIDs: ['e3f68402-5570-4839-a54a-cecd5fd799e5'],
      locationIDs: [],
      holdingIDs: [holdingData.id],
    }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.hasLocationRestrictedFund).toBe(false);
  });

  it('should return hasLocationRestrictedFund as true with holdingIDs', async () => {
    useGetLocationsByHoldingIds.mockClear().mockReturnValue({
      isLoading: false,
      locationIds: ['wringId'],
    });

    const { result } = renderHook(() => useFundsWithRestrictedLocationsById({
      fundIDs: ['e3f68402-5570-4839-a54a-cecd5fd799e5'],
      locationIDs: [],
      holdingIDs: [holdingData.id],
    }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.hasLocationRestrictedFund).toBe(true);
  });
});
