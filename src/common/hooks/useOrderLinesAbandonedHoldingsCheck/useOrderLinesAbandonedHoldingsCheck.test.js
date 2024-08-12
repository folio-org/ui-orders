import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { orderLine } from 'fixtures';
import {
  checkIndependentPOLinesAbandonedHoldings,
  checkSynchronizedPOLinesAbandonedHoldings,
} from '../../utils';
import { UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES } from '../../constants';
import { useOrderLinesAbandonedHoldingsCheck } from './useOrderLinesAbandonedHoldingsCheck';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useCentralOrderingContext: jest.fn(() => ({ isCentralOrderingEnabled: false })),
  useConsortiumTenants: jest.fn(() => ({ tenants: [] })),
  usePublishCoordinator: jest.fn(() => ({ initPublicationRequest: jest.fn() })),
}));
jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  checkIndependentPOLinesAbandonedHoldings: jest.fn(() => () => ({})),
  checkSynchronizedPOLinesAbandonedHoldings: jest.fn(() => () => ({})),
}));

const poLines = [
  orderLine,
  {
    ...orderLine,
    id: 'secondPOLineId',
    checkinItems: true,
  },
];

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const kyMock = {
  extend: jest.fn(),
};

describe('useOrderLinesAbandonedHoldingsCheck', () => {
  beforeEach(() => {
    checkIndependentPOLinesAbandonedHoldings
      .mockClear()
      .mockReturnValue(() => ({ willAbandoned: false }));
    checkSynchronizedPOLinesAbandonedHoldings
      .mockClear()
      .mockReturnValue(() => ({ willAbandoned: false }));
    useOkapiKy
      .mockClear()
      .mockReturnValue(kyMock);
  });

  it('should return default type in result if there are no abandoned holdings', async () => {
    const { result } = renderHook(
      () => useOrderLinesAbandonedHoldingsCheck(poLines),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.result.type).toEqual(UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES.defaultType);
  });

  it('should return \'independent\' type in result if there is at least one abandoned holding related to independent PO Line and not to synchronized', async () => {
    checkIndependentPOLinesAbandonedHoldings.mockReturnValue(() => ({ willAbandoned: true }));

    const { result } = renderHook(
      () => useOrderLinesAbandonedHoldingsCheck(poLines),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.result.type).toEqual(UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES.independent);
  });

  it('should return \'synchronized\' type in result if there is at least one abandoned holding related to synchronized PO Line', async () => {
    checkSynchronizedPOLinesAbandonedHoldings.mockReturnValue(() => ({ willAbandoned: true }));

    const { result } = renderHook(
      () => useOrderLinesAbandonedHoldingsCheck(poLines),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.result.type).toEqual(UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES.synchronized);
  });
});
