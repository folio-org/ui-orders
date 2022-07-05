import { orderLine } from '../../../../../test/jest/fixtures/orderLine';
import { checkRelatedHoldings } from './checkRelatedHoldings';

const pieces = [{}];

const kyMock = {
  get: jest.fn(() => ({
    json: Promise.resolve([{
      pieces,
      totalRecords: pieces.length,
    }]),
  })),
};

describe('checkRelatedHoldings', () => {
  it('should check if holding(s) related to piece(s), which not related to current POLine', async () => {
    const holdingsConfigs = await checkRelatedHoldings(kyMock)(orderLine);

    expect(holdingsConfigs).toEqual(expect.objectContaining({
      relatedToAnother: false,
      willAbandoned: false,
    }));
  });
});
