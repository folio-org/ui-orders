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

export const getPiecesByHoldingIds = (ky) => async (holdingIds) => batchRequest(
  ({ params: searchParams }) => ky.get(ORDER_PIECES_API, { searchParams }).json(),
  holdingIds,
  buildQueryByHoldingIds(PIECE),
  { limit: 1 },
);

export const getItemsByHoldingIds = (ky) => async (holdingIds) => batchRequest(
  ({ params: searchParams }) => ky.get(ITEMS_API, { searchParams }).json(),
  holdingIds,
  buildQueryByHoldingIds(ITEM),
  { limit: 1 },
);

export const getPiecesAndItemsByHoldingIds = (ky) => async (holdingIds) => {
  const holdingsPieces = await getPiecesByHoldingIds(ky)(holdingIds);
  const holdingsItems = await getItemsByHoldingIds(ky)(holdingIds);

  const holdingsPiecesCount = holdingsPieces?.reduce((sum, { totalRecords }) => sum + totalRecords, 0);
  const holdingsItemsCount = holdingsItems?.reduce((sum, { totalRecords }) => sum + totalRecords, 0);

  return {
    holdingsPieces,
    holdingsItems,
    holdingsPiecesCount,
    holdingsItemsCount,
  };
};
