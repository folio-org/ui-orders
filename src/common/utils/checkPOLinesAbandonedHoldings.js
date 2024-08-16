import chunk from 'lodash/chunk';
import uniq from 'lodash/uniq';

import { checkRelatedHoldings } from './checkRelatedHoldings';
import { getHoldingPiecesAndItemsCount } from './getHoldingPiecesAndItemsCount';

const REQUEST_CHUNK_SIZE = 5;

export const checkSynchronizedPOLinesAbandonedHoldings = (ky, options) => async (poLines) => {
  const poLinesChunks = chunk(poLines, REQUEST_CHUNK_SIZE);

  const results = await poLinesChunks.reduce(async (acc, poLinesChunk) => {
    const resolvedAcc = await acc;

    const responses = await Promise.all(poLinesChunk.map(checkRelatedHoldings(ky, options)));

    return [...resolvedAcc, ...responses];
  }, Promise.resolve([]));

  return {
    willAbandoned: results.some(({ willAbandoned }) => Boolean(willAbandoned)),
    holdingsItemsCount: results.reduce((acc, curr) => acc + curr.holdingsItemsCount, 0),
  };
};

export const checkIndependentPOLinesAbandonedHoldings = (ky, options) => async (poLines) => {
  const holdingIds = uniq(
    poLines
      .flatMap(({ locations }) => locations)
      .map(({ holdingId }) => holdingId)
      .filter(Boolean),
  );

  const holdingIdsChunks = chunk(holdingIds, REQUEST_CHUNK_SIZE);

  const results = await holdingIdsChunks.reduce(async (acc, holdingIdsChunk) => {
    const resolvedAcc = await acc;

    const responses = await Promise.all(holdingIdsChunk.map(getHoldingPiecesAndItemsCount(ky, options)));

    return [...resolvedAcc, ...responses];
  }, Promise.resolve([]));

  return {
    willAbandoned: results.some(({ piecesCount, itemsCount }) => (piecesCount + itemsCount) === 0),
    holdingsItemsCount: results.reduce((acc, curr) => acc + curr.itemsCount, 0),
  };
};
