import {
  batchRequest,
  ITEMS_API,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

const PIECE = 'piece';
const ITEM = 'item';

const buildQueryByHoldingIds = (key) => (itemsChunk) => {
  const query = itemsChunk
    .map(holdingId => `${key === ITEM ? 'holdingsRecordId' : 'holdingId'}==${holdingId}`)
    .join(' or ');

  return query || '';
};

export const getPiecesAndItemsCountByHoldingIds = (ky) => async (holdingIds) => {
  const holdingsPieces = await batchRequest(
    ({ params: searchParams }) => ky.get(ORDER_PIECES_API, { searchParams }).json(),
    holdingIds,
    buildQueryByHoldingIds(PIECE),
    { limit: 1 },
  );

  const holdingsItems = await batchRequest(
    ({ params: searchParams }) => ky.get(ITEMS_API, { searchParams }).json(),
    holdingIds,
    buildQueryByHoldingIds(ITEM),
    { limit: 1 },
  );

  const holdingsPiecesCount = holdingsPieces.reduce((sum, { totalRecords }) => sum + totalRecords, 0);
  const holdingsItemsCount = holdingsItems.reduce((sum, { totalRecords }) => sum + totalRecords, 0);

  return {
    holdingsPiecesCount,
    holdingsItemsCount,
  };
};
