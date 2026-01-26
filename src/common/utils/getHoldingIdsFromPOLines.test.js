import { getHoldingIdsFromPOLines } from './getHoldingIdsFromPOLines';
import { getPOLinePieces } from './getPOLinePieces';
import { getPOLineItems } from './getPOLineItems';
import { getConsortiumPOLineItems } from './getConsortiumPOLineItems';

jest.mock('./getPOLinePieces');
jest.mock('./getPOLineItems');
jest.mock('./getConsortiumPOLineItems');

describe('getHoldingIdsFromPOLines', () => {
  const kyMock = jest.fn();
  const poLine = {
    id: 'po-line-1',
    locations: [
      { holdingId: 'holding-1' },
      { holdingId: 'holding-2' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getPOLinePieces.mockReturnValue(() => Promise.resolve([
      { holdingId: 'holding-3' },
      { holdingId: 'holding-1' }, // duplicate
    ]));
    getPOLineItems.mockReturnValue(() => Promise.resolve([
      { holdingsRecordId: 'holding-4' },
    ]));
    getConsortiumPOLineItems.mockReturnValue(() => Promise.resolve([
      { holdingsRecordId: 'holding-4' },
    ]));
  });

  describe('single PO line', () => {
    it('should return unique holding IDs from locations and pieces', async () => {
      const result = await getHoldingIdsFromPOLines(kyMock)(
        [poLine],
        { isCentralOrderingEnabled: false },
      );

      expect(result).toEqual(
        expect.arrayContaining(['holding-1', 'holding-2', 'holding-3', 'holding-4']),
      );
      expect(result).toHaveLength(4);
    });

    it('should filter out undefined/null holding IDs', async () => {
      getPOLinePieces.mockReturnValue(() => Promise.resolve([
        { holdingId: 'holding-3' },
        { holdingId: undefined },
        { holdingId: null },
      ]));

      const result = await getHoldingIdsFromPOLines(kyMock)(
        [poLine],
        { isCentralOrderingEnabled: false },
      );

      expect(result).not.toContain(undefined);
      expect(result).not.toContain(null);
    });

    it('should call getPOLineItems when central ordering is disabled', async () => {
      await getHoldingIdsFromPOLines(kyMock)(
        [poLine],
        { isCentralOrderingEnabled: false },
      );

      expect(getPOLineItems).toHaveBeenCalled();
    });
  });

  describe('multiple PO lines', () => {
    it('should process multiple PO lines in chunks', async () => {
      const poLines = Array.from({ length: 12 }, (_, i) => ({
        id: `po-line-${i}`,
        locations: [{ holdingId: `holding-location-${i}` }],
      }));

      getPOLinePieces.mockReturnValue(() => Promise.resolve([]));
      getPOLineItems.mockReturnValue(() => Promise.resolve([]));

      const result = await getHoldingIdsFromPOLines(kyMock)(
        poLines,
        { isCentralOrderingEnabled: false },
      );

      expect(result).toHaveLength(12);
      expect(getPOLineItems).toHaveBeenCalledTimes(12);
    });

    it('should deduplicate holding IDs across multiple PO lines', async () => {
      const poLines = [
        {
          id: 'po-line-1',
          locations: [{ holdingId: 'holding-1' }],
        },
        {
          id: 'po-line-2',
          locations: [{ holdingId: 'holding-1' }], // same holding
        },
      ];

      getPOLinePieces.mockReturnValue(() => Promise.resolve([]));
      getPOLineItems.mockReturnValue(() => Promise.resolve([]));

      const result = await getHoldingIdsFromPOLines(kyMock)(
        poLines,
        { isCentralOrderingEnabled: false },
      );

      expect(result).toEqual(['holding-1']);
      expect(result).toHaveLength(1);
    });

    it('should aggregate holdings from pieces and items across multiple lines', async () => {
      const poLines = [
        {
          id: 'po-line-1',
          locations: [{ holdingId: 'holding-1' }],
        },
        {
          id: 'po-line-2',
          locations: [{ holdingId: 'holding-2' }],
        },
      ];

      getPOLinePieces.mockReturnValue(() => Promise.resolve([
        { holdingId: 'holding-3' },
      ]));
      getPOLineItems.mockReturnValue(() => Promise.resolve([
        { holdingsRecordId: 'holding-4' },
      ]));

      const result = await getHoldingIdsFromPOLines(kyMock)(
        poLines,
        { isCentralOrderingEnabled: false },
      );

      expect(result).toEqual(
        expect.arrayContaining(['holding-1', 'holding-2', 'holding-3', 'holding-4']),
      );
    });
  });

  describe('empty cases', () => {
    it('should return empty array for PO line with no holdings', async () => {
      const lineWithoutHoldings = {
        id: 'po-line-1',
        locations: [],
      };

      getPOLinePieces.mockReturnValue(() => Promise.resolve([]));
      getPOLineItems.mockReturnValue(() => Promise.resolve([]));

      const result = await getHoldingIdsFromPOLines(kyMock)(
        [lineWithoutHoldings],
        { isCentralOrderingEnabled: false },
      );

      expect(result).toEqual([]);
    });

    it('should handle PO line without locations property', async () => {
      const lineWithoutLocations = {
        id: 'po-line-1',
      };

      getPOLinePieces.mockReturnValue(() => Promise.resolve([
        { holdingId: 'holding-1' },
      ]));
      getPOLineItems.mockReturnValue(() => Promise.resolve([
        { holdingsRecordId: 'holding-2' },
      ]));

      const result = await getHoldingIdsFromPOLines(kyMock)(
        [lineWithoutLocations],
        { isCentralOrderingEnabled: false },
      );

      expect(result).toEqual(expect.arrayContaining(['holding-1', 'holding-2']));
    });

    it('should return empty array for empty PO lines array', async () => {
      const result = await getHoldingIdsFromPOLines(kyMock)(
        [],
        { isCentralOrderingEnabled: false },
      );

      expect(result).toEqual([]);
    });
  });

  describe('large batch processing', () => {
    it('should chunk process large number of PO lines', async () => {
      const poLines = Array.from({ length: 15 }, (_, i) => ({
        id: `po-line-${i}`,
        locations: [{ holdingId: `holding-${i}` }],
      }));

      getPOLinePieces.mockReturnValue(() => Promise.resolve([]));
      getPOLineItems.mockReturnValue(() => Promise.resolve([]));

      const result = await getHoldingIdsFromPOLines(kyMock)(
        poLines,
        { isCentralOrderingEnabled: false },
      );

      // 15 lines with 1 holding each = 15 holdings
      expect(result).toHaveLength(15);
      expect(getPOLineItems).toHaveBeenCalledTimes(15);
    });
  });

  describe('error handling', () => {
    it('should handle getPOLinePieces errors gracefully', async () => {
      getPOLinePieces.mockReturnValue(() => Promise.reject(new Error('Pieces fetch failed')));

      await expect(
        getHoldingIdsFromPOLines(kyMock)(
          [poLine],
          { isCentralOrderingEnabled: false },
        ),
      ).rejects.toThrow('Pieces fetch failed');
    });

    it('should handle getPOLineItems errors gracefully', async () => {
      getPOLineItems.mockReturnValue(() => Promise.reject(new Error('Items fetch failed')));

      await expect(
        getHoldingIdsFromPOLines(kyMock)(
          [poLine],
          { isCentralOrderingEnabled: false },
        ),
      ).rejects.toThrow('Items fetch failed');
    });
  });

  describe('options handling', () => {
    it('should pass options to nested functions', async () => {
      const abortController = new AbortController();
      const options = {
        isCentralOrderingEnabled: false,
        signal: abortController.signal,
      };

      await getHoldingIdsFromPOLines(kyMock)([poLine], options);

      expect(getPOLinePieces).toHaveBeenCalledWith(kyMock);
      expect(getPOLineItems).toHaveBeenCalledWith(kyMock);
    });
  });
});
