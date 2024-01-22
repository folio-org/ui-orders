import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useFundsWithRestrictedLocationsById } from './useFundsWithRestrictedLocationsById';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

jest.mock('../index', () => ({
  ...jest.requireActual('../index'),
  useFundsById: jest.fn().mockReturnValue({ funds: [{
    'id': 'e3f68402-5570-4839-a54a-cecd5fd799e5',
    'name': 'Location restricted',
    'restrictByLocations': true,
    'locationIds': [
      '53cf956f-c1df-410b-8bea-27f712cca7c0',
      '184aae84-a5bf-4c6a-85ba-4a7c73026cd5',
    ],
  }] }),
  useGetLocationsByHoldingIds: jest.fn().mockReturnValue({ locationIds: ['1'] }),
}));

describe('useFundsWithRestrictedLocationsById', () => {
  it('should return hasLocationRestrictedFund as true', () => {
    const { result } = renderHook(() => useFundsWithRestrictedLocationsById({
      fundIDs: ['e3f68402-5570-4839-a54a-cecd5fd799e5'],
      locationIDs: ['testId'],
      holdingIds: [],
    }), { wrapper });

    expect(result.current.hasLocationRestrictedFund).toBe(false);
  });
});
