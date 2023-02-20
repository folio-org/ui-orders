import chunk from 'lodash/chunk';
import uniq from 'lodash/uniq';

import {
  batchRequest,
  fetchAllRecords,
  ITEMS_API,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

const PIECE = 'piece';
const ITEM = 'item';
const CHUNK_SIZE = 5;

const buildQueryByHoldingIds = (key) => (itemsChunk) => {
  const query = itemsChunk
    .map(holdingId => `${key === ITEM ? 'holdingsRecordId' : 'holdingId'}==${holdingId}`)
    .join(' or ');

  return query || '';
};

const getPOLinePieces = (ky) => async (poLine) => fetchAllRecords(
  {
    GET: async ({ params: searchParams }) => {
      const { pieces } = await ky.get(ORDER_PIECES_API, { searchParams }).json();

      return pieces;
    },
  },
  `poLineId==${poLine.id}`,
);

const getPOLineItems = (ky) => async (poLine) => fetchAllRecords(
  {
    GET: async ({ params: searchParams }) => {
      const { items } = await ky.get(ITEMS_API, { searchParams }).json();

      return items;
    },
  },
  `purchaseOrderLineIdentifier==${poLine.id}`,
);

const getPiecesByHoldingIds = (ky) => async (holdingIds) => batchRequest(
  ({ params: searchParams }) => ky.get(ORDER_PIECES_API, { searchParams }).json(),
  holdingIds,
  buildQueryByHoldingIds(PIECE),
  { limit: 1 },
);

const getItemsByHoldingIds = (ky) => async (holdingIds) => batchRequest(
  ({ params: searchParams }) => ky.get(ITEMS_API, { searchParams }).json(),
  holdingIds,
  buildQueryByHoldingIds(ITEM),
  { limit: 1 },
);

const getPiecesAndItemsByHoldingIds = (ky) => async (holdingIds) => {
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

export const checkRelatedHoldings = (ky) => async (poLine) => {
  const poLinePieces = await getPOLinePieces(ky)(poLine);
  const poLineItems = await getPOLineItems(ky)(poLine);

  const holdingIds = uniq(
    poLinePieces
      ?.map(({ holdingId }) => holdingId)
      ?.filter(Boolean),
  );

  const {
    holdingsPiecesCount,
    holdingsItemsCount,
  } = await getPiecesAndItemsByHoldingIds(ky)(holdingIds);

  const relatedToAnother = (
    (holdingsPiecesCount - poLinePieces.length) > 0 || (holdingsItemsCount - poLineItems.length) > 0
  );

  return {
    holdingIds,
    relatedToAnother,
    willAbandoned: Boolean(holdingIds.length && !relatedToAnother),
  };
};

// TODO: add useful comment
export const checkSynchronizedPOLinesRelatedHoldings = (ky) => async (poLines) => {
  const poLinesChunks = chunk(poLines, CHUNK_SIZE);
  const checkSynchronizedPOLine = checkRelatedHoldings(ky);

  const results = await poLinesChunks.reduce(async (acc, poLinesChunk) => {
    const resolvedAcc = await acc;

    const responses = await Promise.all(poLinesChunk.map(checkSynchronizedPOLine));

    return [...resolvedAcc, ...responses];
  }, Promise.resolve([]));

  console.log('sync results', results);

  return {
    holdingIds: uniq(results.flatMap(({ holdingIds }) => holdingIds)),
    willAbandoned: results.some(({ willAbandoned }) => Boolean(willAbandoned)),
  };
};

// -----------

const getHoldingPiecesCount = (ky) => async (holdingId) => {
  const searchParams = {
    query: `holdingId==${holdingId}`,
    limit: 1,
  };

  return ky.get(ORDER_PIECES_API, { searchParams })
    .json()
    .then(({ totalRecords }) => totalRecords);
};

const getHoldingItemsCount = (ky) => async (holdingId) => {
  const searchParams = {
    query: `holdingsRecordId==${holdingId}`,
    limit: 1,
  };

  return ky.get(ITEMS_API, { searchParams })
    .json()
    .then(({ totalRecords }) => totalRecords);
};

const getHoldingPiecesAndItemsCount = (ky) => async (holdingId) => {
  const [piecesCount, itemsCount] = await Promise.all([
    getHoldingPiecesCount(ky)(holdingId),
    getHoldingItemsCount(ky)(holdingId),
  ]);

  return {
    piecesCount,
    itemsCount,
  };
};

// ------------

// TODO: add useful comment
export const checkIndependentPOLinesRelatedHoldings = (ky) => async (poLines) => {
  const holdingIds = uniq(
    poLines
      ?.flatMap(({ locations }) => locations)
      ?.map(({ holdingId }) => holdingId)
      ?.filter(Boolean),
  );

  const holdingIdsChunks = chunk(holdingIds, CHUNK_SIZE);

  const results = await holdingIdsChunks.reduce(async (acc, holdingIdsChunk) => {
    const resolvedAcc = await acc;

    const responses = await Promise.all(holdingIdsChunk.map(getHoldingPiecesAndItemsCount(ky)));

    return [...resolvedAcc, ...responses];
  }, Promise.resolve([]));

  const willAbandoned = results.some(({ piecesCount, itemsCount }) => (piecesCount + itemsCount) === 0);

  console.log('independent results', results);
  console.log('willAbandoned', willAbandoned);

  return {
    holdingIds,
    // willAbandoned: Boolean(holdingIds.length && !isHoldingsNotEmpty),
    willAbandoned,
  };
};
