import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { useHoldingsByIds } from '../../../../common/hooks';
import { useFundsById } from '../useFundsById';
import { useIsFundsRestrictedByLocationIds } from './useIsFundsRestrictedByLocationIds';

jest.mock('../useFundsById', () => ({
  useFundsById: jest.fn(),
}));
jest.mock('../../../../common/hooks', () => ({
  useHoldingsByIds: jest.fn(),
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
  'locations': [
    { locationId: '53cf956f-c1df-410b-8bea-27f712cca7c0' },
    { locationId: '184aae84-a5bf-4c6a-85ba-4a7c73026cd5' },
  ],
};

const fundIds = [restrictedFund.id];

const holdingData = {
  'id': '53cf956f-c1df-410b-8bea-27f712cca7c0',
  'permanentLocationId': restrictedFund.locations[0].locationId,
};

describe('useIsFundsRestrictedByLocationIds', () => {
  beforeEach(() => {
    useFundsById
      .mockClear()
      .mockReturnValue({
        funds: [restrictedFund],
        isLoading: false,
      });
    useHoldingsByIds
      .mockClear()
      .mockReturnValue({
        isLoading: false,
        holdings: [],
      });
  });

  it('should return hasLocationRestrictedFund as true', async () => {
    const { result } = renderHook(() => useIsFundsRestrictedByLocationIds({
      fundIds,
      locations: ['testId'],
      holdingIds: [],
    }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.hasLocationRestrictedFund).toBe(true);
  });

  it('should return hasLocationRestrictedFund as false', async () => {
    const { result } = renderHook(() => useIsFundsRestrictedByLocationIds({
      fundIds,
      locationIds: restrictedFund.locations.map(({ locationId }) => locationId),
      holdingIds: [],
    }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.hasLocationRestrictedFund).toBe(false);
  });

  it('should return hasLocationRestrictedFund as false with holdingIds', async () => {
    useHoldingsByIds.mockClear().mockReturnValue({
      isLoading: false,
      holdings: [holdingData],
    });

    const { result } = renderHook(() => useIsFundsRestrictedByLocationIds({
      fundIds,
      locationIds: [],
      holdingIds: [holdingData.id],
    }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.hasLocationRestrictedFund).toBe(false);
  });

  it('should return hasLocationRestrictedFund as true with holdingIds', async () => {
    useHoldingsByIds.mockClear().mockReturnValue({
      isLoading: false,
      holdings: [{ ...holdingData, permanentLocationId: 'wrongId' }],
    });

    const { result } = renderHook(() => useIsFundsRestrictedByLocationIds({
      fundIds,
      locationIds: [],
      holdingIds: [holdingData.id],
    }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.hasLocationRestrictedFund).toBe(true);
  });
});
