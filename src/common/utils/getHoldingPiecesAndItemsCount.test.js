import {
  ITEMS_API,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

import { getHoldingPiecesAndItemsCount } from './getHoldingPiecesAndItemsCount';

const kyMock = {
  get: jest.fn((url) => ({
    json: async () => {
      const responsesMap = {
        [ITEMS_API]: { totalRecords: 3 },
        [ORDER_PIECES_API]: { totalRecords: 2 },
      };

      return Promise.resolve(responsesMap[url] || { totalRecords: 1 });
    },
  })),
};

describe('getHoldingPiecesAndItemsCount', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
  });

  it('should return count of pieces and items related to holding', async () => {
    const { piecesCount, itemsCount } = await getHoldingPiecesAndItemsCount(kyMock)('holdingId');

    expect(kyMock.get).toHaveBeenCalled();
    expect(piecesCount).toEqual(2);
    expect(itemsCount).toEqual(3);
  });
});
