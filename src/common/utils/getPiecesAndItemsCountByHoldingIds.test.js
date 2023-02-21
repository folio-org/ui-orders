import {
  ITEMS_API,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

import { getPiecesAndItemsCountByHoldingIds } from './getPiecesAndItemsCountByHoldingIds';

const itemsBatchResponse = [
  { totalRecords: 1 },
  { totalRecords: 4 },
  { totalRecords: 5 },
];

const piecesBatchResponse = [
  { totalRecords: 2 },
  { totalRecords: 12 },
  { totalRecords: 6 },
];

const kyMock = {
  get: jest.fn((url) => ({
    json: async () => {
      const responsesMap = {
        [ITEMS_API]: itemsBatchResponse,
        [ORDER_PIECES_API]: piecesBatchResponse,
      };

      return Promise.resolve(responsesMap[url] || { totalRecords: 1 });
    },
  })),
};

describe('getPiecesAndItemsCountByHoldingIds', () => {
  const holdingIds = ['holdingId-1', 'holdingId-2', 'holdingId-3'];

  it('should return pieces and items fetched by holding IDs', async () => {
    const {
      holdingsPiecesCount,
      holdingsItemsCount,
    } = await getPiecesAndItemsCountByHoldingIds(kyMock)(holdingIds);

    expect(kyMock.get).toHaveBeenCalled();
    expect(holdingsItemsCount).toEqual(10);
    expect(holdingsPiecesCount).toEqual(20);
  });
});
