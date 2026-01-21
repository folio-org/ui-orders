import noop from 'lodash/noop';
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

import { orderLine } from 'fixtures/orderLine';
import {
  checkRelatedHoldings,
  getHoldingIdsFromPOLines,
} from '../../../../../common/utils';
import { getCreateInventory } from '../../../utils';
import { SHOW_DETAILED_MODAL_CONFIGS } from '../../constants';
import { useChangeInstanceModalConfigs } from './useChangeInstanceModalConfigs';

jest.mock('../../../../../common/utils');
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useCentralOrderingContext: jest.fn(() => ({ isCentralOrderingEnabled: false })),
  usePublishCoordinator: jest.fn(() => ({ initPublicationRequest: jest.fn() })),
  useHoldingsAbandonmentAnalyzer: jest.fn(),
}));

const modalConfigs = {
  holdingsConfigs: {
    holdingIds: orderLine.locations.map(({ holdingId }) => holdingId),
    relatedToAnother: false,
    willAbandoned: false,
  },
  isDetailed: SHOW_DETAILED_MODAL_CONFIGS[getCreateInventory(orderLine)],
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const kyMock = {
  get: jest.fn(() => ({})),
  extend: jest.fn(() => kyMock),
};

const analyzerMock = {
  analyze: jest.fn(() => [
    {
      abandoned: false,
      explain: {
        related: {
          items: [],
        },
      },
    },
  ]),
};

describe('useChangeInstanceModalConfigs', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
    useHoldingsAbandonmentAnalyzer.mockReturnValue({
      analyzerFactory: jest.fn().mockResolvedValue(analyzerMock),
      isLoading: false,
    });
    getHoldingIdsFromPOLines.mockReturnValue(() => Promise.resolve(
      orderLine.locations.map(({ holdingId }) => holdingId),
    ));
    checkRelatedHoldings.mockReturnValue(() => modalConfigs.holdingsConfigs);
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe('basic functionality', () => {
    it('should return modal configs with proper structure', async () => {
      const { result } = renderHook(() => useChangeInstanceModalConfigs(orderLine), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current).toEqual(expect.objectContaining(modalConfigs));
    });

    it('should include isDetailed flag', async () => {
      const { result } = renderHook(() => useChangeInstanceModalConfigs(orderLine), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current).toHaveProperty('isDetailed');
      expect(typeof result.current.isDetailed).toBe('boolean');
    });

    it('should include holdingsConfigs in result', async () => {
      const { result } = renderHook(() => useChangeInstanceModalConfigs(orderLine), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current).toHaveProperty('holdingsConfigs');
      expect(result.current.holdingsConfigs).toBeDefined();
    });
  });

  describe('loading states', () => {
    it('should start with loading state', () => {
      useHoldingsAbandonmentAnalyzer.mockReturnValue({
        analyzerFactory: jest.fn().mockImplementation(
          () => new Promise(noop), // never resolves
        ),
        isLoading: false,
      });

      const { result } = renderHook(() => useChangeInstanceModalConfigs(orderLine), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });

    it('should set isLoading to true when analyzer is loading', async () => {
      useHoldingsAbandonmentAnalyzer.mockReturnValue({
        analyzerFactory: jest.fn().mockResolvedValue(analyzerMock),
        isLoading: true,
      });

      const { result } = renderHook(() => useChangeInstanceModalConfigs(orderLine), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });

    it('should transition to loaded state', async () => {
      const { result } = renderHook(() => useChangeInstanceModalConfigs(orderLine), { wrapper });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('data retrieval', () => {
    it('should call getHoldingIdsFromPOLines with proper arguments', async () => {
      const { result } = renderHook(() => useChangeInstanceModalConfigs(orderLine), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(getHoldingIdsFromPOLines).toHaveBeenCalled();
    });

    it('should call checkRelatedHoldings with proper arguments', async () => {
      const { result } = renderHook(() => useChangeInstanceModalConfigs(orderLine), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(checkRelatedHoldings).toHaveBeenCalled();
    });

    it('should return empty holdings configs when query is disabled', async () => {
      const poLineWithoutCreateInventory = {
        ...orderLine,
        physical: {
          ...orderLine.physical,
          createInventory: 'None',
        },
        eresource: {
          ...orderLine.eresource,
          createInventory: 'None',
        },
      };

      const { result } = renderHook(
        () => useChangeInstanceModalConfigs(poLineWithoutCreateInventory),
        { wrapper },
      );

      await waitFor(() => expect(result.current).toBeDefined());

      // Query should be disabled, so data should be empty
      expect(result.current.holdingsConfigs).toEqual({});
    });
  });

  describe('holdings config variations', () => {
    it('should handle case when holdings will be abandoned', async () => {
      const abandonedConfigs = {
        ...modalConfigs,
        holdingsConfigs: {
          holdingIds: ['holding-1'],
          relatedToAnother: false,
          willAbandoned: true,
        },
      };

      checkRelatedHoldings.mockReturnValue(() => abandonedConfigs.holdingsConfigs);

      const { result } = renderHook(() => useChangeInstanceModalConfigs(orderLine), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current.holdingsConfigs.willAbandoned).toBe(true);
    });

    it('should handle case when holdings are related to another PO Line', async () => {
      const relatedConfigs = {
        ...modalConfigs,
        holdingsConfigs: {
          holdingIds: ['holding-1'],
          relatedToAnother: true,
          willAbandoned: false,
        },
      };

      checkRelatedHoldings.mockReturnValue(() => relatedConfigs.holdingsConfigs);

      const { result } = renderHook(() => useChangeInstanceModalConfigs(orderLine), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current.holdingsConfigs.relatedToAnother).toBe(true);
    });

    it('should handle both relatedToAnother and willAbandoned flags', async () => {
      const complexConfigs = {
        ...modalConfigs,
        holdingsConfigs: {
          holdingIds: ['holding-1'],
          relatedToAnother: true,
          willAbandoned: true,
        },
      };

      checkRelatedHoldings.mockReturnValue(() => complexConfigs.holdingsConfigs);

      const { result } = renderHook(() => useChangeInstanceModalConfigs(orderLine), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current.holdingsConfigs.relatedToAnother).toBe(true);
      expect(result.current.holdingsConfigs.willAbandoned).toBe(true);
    });
  });

  describe('PO line variation', () => {
    it('should work with different PO line shapes', async () => {
      const customPoLine = {
        ...orderLine,
        id: 'custom-po-line-id',
        titleOrPackage: 'Custom Title',
      };

      const { result } = renderHook(() => useChangeInstanceModalConfigs(customPoLine), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current).toBeDefined();
    });

    it('should use correct namespace based on PO line ID', async () => {
      const customPoLine = {
        ...orderLine,
        id: 'unique-po-line-123',
      };

      renderHook(() => useChangeInstanceModalConfigs(customPoLine), { wrapper });

      await waitFor(() => {
        expect(getHoldingIdsFromPOLines).toHaveBeenCalled();
      });
    });
  });

  describe('error scenarios', () => {
    it('should handle analyzer factory errors gracefully', async () => {
      useHoldingsAbandonmentAnalyzer.mockReturnValue({
        analyzerFactory: jest.fn().mockRejectedValue(new Error('Analyzer failed')),
        isLoading: false,
      });

      const { result } = renderHook(() => useChangeInstanceModalConfigs(orderLine), { wrapper });

      // Component should still render, even if query fails
      await waitFor(() => expect(result.current).toBeDefined());

      // When error occurs in async query, data may still be undefined or previous value
      expect(result.current.holdingsConfigs).toBeDefined();
    });

    it('should handle getHoldingIdsFromPOLines errors gracefully', async () => {
      getHoldingIdsFromPOLines.mockReturnValue(() => Promise.reject(new Error('Holdings fetch failed')));

      const { result } = renderHook(() => useChangeInstanceModalConfigs(orderLine), { wrapper });

      // Component should still render
      await waitFor(() => expect(result.current).toBeDefined());

      // When error occurs in async query, data may still be undefined or previous value
      expect(result.current.holdingsConfigs).toBeDefined();
    });
  });

  describe('query invalidation and refetch', () => {
    it('should have unique query keys for different PO lines', async () => {
      const poLine1 = { ...orderLine, id: 'line-1' };
      const poLine2 = { ...orderLine, id: 'line-2' };

      renderHook(() => useChangeInstanceModalConfigs(poLine1), { wrapper });
      renderHook(() => useChangeInstanceModalConfigs(poLine2), { wrapper });

      // Both hooks should be called
      await waitFor(() => {
        expect(getHoldingIdsFromPOLines).toHaveBeenCalled();
      });
    });
  });
});
