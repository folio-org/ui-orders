import {
  checkIndependentPOLinesAbandonedHoldings,
  checkSynchronizedPOLinesAbandonedHoldings,
} from './checkPOLinesAbandonedHoldings';

import { orderLine } from '../../../test/jest/fixtures';
import { checkRelatedHoldings } from './checkRelatedHoldings';
import { getHoldingPiecesAndItemsCount } from './getHoldingPiecesAndItemsCount';

jest.mock('./checkRelatedHoldings');
jest.mock('./getHoldingPiecesAndItemsCount');

const poLines = new Array(11)
  .fill({ ...orderLine })
  .map((poLine, i) => ({
    ...poLine,
    locations: [{
      holdingId: `holdingId-${i}`,
    }],
  }));

describe('PO Lines list contains at least one line with \'Synchronized order and receipt quantity\' receiving workflow', () => {
  const checkSynchronized = jest.fn(() => Promise.resolve({ willAbandoned: false }));

  beforeEach(() => {
    checkSynchronized.mockClear();
    checkRelatedHoldings.mockClear().mockReturnValue(checkSynchronized);
  });

  describe('checkSynchronizedPOLinesAbandonedHoldings', () => {
    it('should return \'willAbandoned\' value as \'false\' if there are no abandoned holdings', async () => {
      const { willAbandoned } = await checkSynchronizedPOLinesAbandonedHoldings({})(poLines);

      expect(willAbandoned).toBeFalsy();
    });

    it('should return \'willAbandoned\' value as \'true\' if there are some abandoned holdings', async () => {
      checkSynchronized.mockResolvedValueOnce({ willAbandoned: true });
      const { willAbandoned } = await checkSynchronizedPOLinesAbandonedHoldings({})(poLines);

      expect(willAbandoned).toBeTruthy();
    });
  });
});

describe('PO Lines list contains at least one line with \'Independent order and receipt quantity\' receiving workflow', () => {
  const checkIndependent = jest.fn(() => Promise.resolve({ piecesCount: 1, itemsCount: 1 }));

  beforeEach(() => {
    getHoldingPiecesAndItemsCount.mockClear().mockReturnValue(checkIndependent);
  });

  describe('checkIndependentPOLinesAbandonedHoldings', () => {
    it('should return \'willAbandoned\' value as \'false\' if there are no abandoned holdings', async () => {
      const { willAbandoned } = await checkIndependentPOLinesAbandonedHoldings({})(poLines);

      expect(willAbandoned).toBeFalsy();
    });

    it('should return \'willAbandoned\' value as \'true\' if there are some abandoned holdings', async () => {
      checkIndependent.mockResolvedValueOnce({ piecesCount: 0, itemsCount: 0 });
      const { willAbandoned } = await checkIndependentPOLinesAbandonedHoldings({})(poLines);

      expect(willAbandoned).toBeTruthy();
    });
  });
});
