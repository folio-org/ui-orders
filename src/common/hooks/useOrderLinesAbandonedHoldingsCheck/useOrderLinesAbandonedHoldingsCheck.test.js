import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { useHoldingsAbandonmentAnalyzer } from '@folio/stripes-acq-components';

import { orderLine } from 'fixtures';
import { UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES } from '../../constants';
import { checkRelatedHoldings } from '../../utils';
import { useOrderLinesAbandonedHoldingsCheck } from './useOrderLinesAbandonedHoldingsCheck';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useCentralOrderingContext: jest.fn(() => ({ isCentralOrderingEnabled: false })),
  useConsortiumTenants: jest.fn(() => ({ tenants: [], isLoading: false })),
  useHoldingsAbandonmentAnalyzer: jest.fn(),
  usePublishCoordinator: jest.fn(() => ({ initPublicationRequest: jest.fn() })),
}));

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  getHoldingIdsFromPOLines: jest.fn(() => jest.fn().mockResolvedValue(['holding-1', 'holding-2'])),
  checkRelatedHoldings: jest.fn(),
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
  extend: jest.fn(() => this),
};

describe('useOrderLinesAbandonedHoldingsCheck', () => {
  const analyzerFactoryMock = jest.fn().mockResolvedValue({
    analyze: jest.fn(() => [
      {
        abandoned: false,
        explain: { related: { items: [] } },
      },
    ]),
  });

  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
    useHoldingsAbandonmentAnalyzer.mockReturnValue({
      analyzerFactory: analyzerFactoryMock,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return default type in result if there are no abandoned holdings', async () => {
    checkRelatedHoldings.mockReturnValue(() => ({
      holdingIds: ['holding-1'],
      holdingsItemsCount: 0,
      relatedToAnother: false,
      willAbandoned: false,
    }));

    const { result } = renderHook(
      () => useOrderLinesAbandonedHoldingsCheck(poLines),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.result.type).toEqual(UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES.defaultType);
  });

  it('should return \'independent\' type in result if there is at least one abandoned holding related to independent PO Line and not to synchronized', async () => {
    analyzerFactoryMock.mockResolvedValue({
      analyze: jest.fn(() => [
        {
          abandoned: false,
          explain: { related: { items: [] } },
        },
      ]),
    });

    let callCount = 0;

    checkRelatedHoldings.mockReturnValue(() => {
      callCount++;
      if (callCount === 1) {
        // synchronized - no abandoned
        return {
          holdingIds: ['holding-1'],
          holdingsItemsCount: 0,
          relatedToAnother: false,
          willAbandoned: false,
        };
      } else {
        // independent - abandoned
        return {
          holdingIds: ['holding-1'],
          holdingsItemsCount: 1,
          relatedToAnother: false,
          willAbandoned: true,
        };
      }
    });

    const { result } = renderHook(() => useOrderLinesAbandonedHoldingsCheck(poLines), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.result.type).toEqual(UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES.independent);
  });

  it('should return \'synchronized\' type in result if there is at least one abandoned holding related to synchronized PO Line', async () => {
    useHoldingsAbandonmentAnalyzer.mockReturnValue({
      analyzerFactory: jest.fn().mockResolvedValue({
        analyze: jest.fn(() => [
          {
            abandoned: false,
            explain: { related: { items: [] } },
          },
        ]),
      }),
      isLoading: false,
    });

    let callCount = 0;

    checkRelatedHoldings.mockReturnValue(() => {
      callCount++;
      if (callCount === 1) {
        // synchronized - abandoned
        return {
          holdingIds: ['holding-1'],
          holdingsItemsCount: 1,
          relatedToAnother: false,
          willAbandoned: true,
        };
      } else {
        // independent - not abandoned
        return {
          holdingIds: ['holding-1'],
          holdingsItemsCount: 0,
          relatedToAnother: false,
          willAbandoned: false,
        };
      }
    });

    const { result } = renderHook(() => useOrderLinesAbandonedHoldingsCheck(poLines), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.result.type).toEqual(UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES.synchronized);
  });
});
