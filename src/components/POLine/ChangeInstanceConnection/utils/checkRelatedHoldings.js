import uniq from 'lodash/uniq';

import {
  batchRequest,
  fetchAllRecords,
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

export const checkRelatedHoldings = (ky) => async (poLine) => {
  const poLinePieces = await fetchAllRecords(
    {
      GET: async ({ params: searchParams }) => {
        const { pieces } = await ky.get(ORDER_PIECES_API, { searchParams }).json();

        return pieces;
      },
    },
    `poLineId==${poLine.id}`,
  );

  const poLineItems = await fetchAllRecords(
    {
      GET: async ({ params: searchParams }) => {
        const { items } = await ky.get(ITEMS_API, { searchParams }).json();

        return items;
      },
    },
    `purchaseOrderLineIdentifier==${poLine.id}`,
  );

  const holdingIds = uniq(
    poLinePieces
      ?.map(({ holdingId }) => holdingId)
      ?.filter(Boolean),
  );

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

  const holdingsPiecesCount = holdingsPieces?.reduce((sum, { totalRecords }) => sum + totalRecords, 0);
  const holdingsItemsCount = holdingsItems?.reduce((sum, { totalRecords }) => sum + totalRecords, 0);

  const relatedToAnother = (
    (holdingsPiecesCount - poLinePieces.length) > 0 || (holdingsItemsCount - poLineItems.length) > 0
  );

  return {
    holdingIds,
    relatedToAnother,
    willAbandoned: Boolean(holdingIds.length && !relatedToAnother),
  };
};
