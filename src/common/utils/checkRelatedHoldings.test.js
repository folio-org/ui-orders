import { orderLine } from 'fixtures';
import { checkRelatedHoldings } from './checkRelatedHoldings';

const analyzerMock = {
  analyze: jest.fn(() => [
    {
      abandoned: true,
      explain: {
        related: {
          items: [],
        },
      },
    },
  ]),
};

describe('checkRelatedHoldings', () => {
  it('should check if holding(s) related to piece(s), which not related to current POLine', () => {
    const holdingIds = ['holding-id-1'];
    const holdingsConfigs = checkRelatedHoldings(analyzerMock)([orderLine], holdingIds);

    expect(holdingsConfigs).toEqual(expect.objectContaining({
      relatedToAnother: false,
      willAbandoned: true,
    }));
  });
});
