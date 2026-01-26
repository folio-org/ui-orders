import { orderLine } from 'fixtures';
import { checkRelatedHoldings } from './checkRelatedHoldings';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  HoldingsAbandonmentPOLineStrategy: {
    name: 'PO_LINE',
  },
}));

describe('checkRelatedHoldings', () => {
  const createAnalyzerMock = (results) => ({
    analyze: jest.fn(() => results),
  });

  describe('with abandoned holdings', () => {
    it('should return willAbandoned: true when holding will be abandoned', () => {
      const analyzerMock = createAnalyzerMock([
        {
          abandoned: true,
          explain: { related: { items: [] } },
        },
      ]);
      const holdingIds = ['holding-id-1'];

      const result = checkRelatedHoldings(analyzerMock)([orderLine], holdingIds);

      expect(result).toEqual(expect.objectContaining({
        relatedToAnother: false,
        willAbandoned: true,
        holdingIds,
      }));
    });

    it('should calculate holdingsItemsCount from related items', () => {
      const analyzerMock = createAnalyzerMock([
        {
          abandoned: true,
          explain: {
            related: {
              items: [{ id: 'item-1' }, { id: 'item-2' }],
            },
          },
        },
      ]);
      const holdingIds = ['holding-id-1'];

      const result = checkRelatedHoldings(analyzerMock)([orderLine], holdingIds);

      expect(result.holdingsItemsCount).toBe(2);
    });
  });

  describe('with related holdings', () => {
    it('should return relatedToAnother: true when holding is related to another PO Line', () => {
      const analyzerMock = createAnalyzerMock([
        {
          abandoned: false,
          explain: { related: { items: [] } },
        },
      ]);
      const holdingIds = ['holding-id-1'];

      const result = checkRelatedHoldings(analyzerMock)([orderLine], holdingIds);

      expect(result).toEqual(expect.objectContaining({
        relatedToAnother: true,
        willAbandoned: false,
      }));
    });

    it('should aggregate items count from multiple holdings', () => {
      const analyzerMock = createAnalyzerMock([
        {
          abandoned: false,
          explain: {
            related: {
              items: [{ id: 'item-1' }, { id: 'item-2' }],
            },
          },
        },
        {
          abandoned: false,
          explain: {
            related: {
              items: [{ id: 'item-3' }],
            },
          },
        },
      ]);
      const holdingIds = ['holding-id-1', 'holding-id-2'];

      const result = checkRelatedHoldings(analyzerMock)([orderLine, { ...orderLine, id: 'line-2' }], holdingIds);

      expect(result.holdingsItemsCount).toBe(3);
    });
  });

  describe('with empty holdings', () => {
    it('should return false flags when no holdingIds provided', () => {
      const analyzerMock = createAnalyzerMock([
        {
          abandoned: false,
          explain: { related: { items: [] } },
        },
      ]);

      const result = checkRelatedHoldings(analyzerMock)([orderLine], []);

      expect(result).toEqual(expect.objectContaining({
        relatedToAnother: 0, // holdingIds.length && ... evaluates to 0
        willAbandoned: 0,    // holdingIds.length && ... evaluates to 0
        holdingIds: [],
      }));
    });

    it('should handle missing explain structure gracefully', () => {
      const analyzerMock = createAnalyzerMock([
        {
          abandoned: true,
        },
      ]);
      const holdingIds = ['holding-id-1'];

      const result = checkRelatedHoldings(analyzerMock)([orderLine], holdingIds);

      expect(result.holdingsItemsCount).toBe(0);
      expect(result.willAbandoned).toBe(true);
    });
  });

  describe('analyzer.analyze call', () => {
    it('should call analyzer.analyze with correct parameters', () => {
      const analyzerMock = createAnalyzerMock([
        { abandoned: false, explain: { related: { items: [] } } },
      ]);
      const holdingIds = ['holding-id-1', 'holding-id-2'];
      const poLines = [orderLine, { ...orderLine, id: 'line-2' }];

      checkRelatedHoldings(analyzerMock)(poLines, holdingIds);

      expect(analyzerMock.analyze).toHaveBeenCalledWith({
        explain: true,
        holdingIds,
        ids: poLines.map(({ id }) => id),
        strategy: 'PO_LINE',
      });
    });
  });

  describe('mixed scenarios', () => {
    it('should handle mixed abandoned and related holdings', () => {
      const analyzerMock = createAnalyzerMock([
        {
          abandoned: true,
          explain: { related: { items: [{ id: 'item-1' }] } },
        },
        {
          abandoned: false,
          explain: { related: { items: [{ id: 'item-2' }, { id: 'item-3' }] } },
        },
      ]);
      const holdingIds = ['holding-id-1', 'holding-id-2'];
      const poLines = [orderLine, { ...orderLine, id: 'line-2' }];

      const result = checkRelatedHoldings(analyzerMock)(poLines, holdingIds);

      expect(result).toEqual(expect.objectContaining({
        relatedToAnother: true,
        willAbandoned: true,
        holdingsItemsCount: 3,
      }));
    });

    it('should return willAbandoned: false when multiple lines share same holding but not abandoned', () => {
      const analyzerMock = createAnalyzerMock([
        {
          abandoned: false,
          explain: { related: { items: [] } },
        },
        {
          abandoned: false,
          explain: { related: { items: [] } },
        },
      ]);
      const holdingIds = ['holding-id-1'];
      const poLines = [orderLine, { ...orderLine, id: 'line-2' }];

      const result = checkRelatedHoldings(analyzerMock)(poLines, holdingIds);

      expect(result).toEqual(expect.objectContaining({
        relatedToAnother: true,
        willAbandoned: false,
        holdingIds,
      }));
      expect(result.holdingsItemsCount).toBe(0);
    });
  });
});
