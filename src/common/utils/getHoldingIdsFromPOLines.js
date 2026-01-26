import chunk from 'lodash/chunk';
import get from 'lodash/get';
import uniq from 'lodash/uniq';

import { getConsortiumPOLineItems } from './getConsortiumPOLineItems';
import { getPOLineItems } from './getPOLineItems';
import { getPOLinePieces } from './getPOLinePieces';

const getHoldingIdsFromPOLine = (ky, options = {}) => async (poLine) => {
  const {
    isCentralOrderingEnabled,
    initPublicationRequest,
    signal,
  } = options;

  const poLinePieces = await getPOLinePieces(ky)(poLine);
  const poLineItems = isCentralOrderingEnabled
    ? await getConsortiumPOLineItems(initPublicationRequest, { signal })(poLine)
    : await getPOLineItems(ky)(poLine);

  const holdingIds = uniq([
    ...get(poLine, 'locations', []).map(({ holdingId }) => holdingId),
    ...poLinePieces.map(({ holdingId }) => holdingId),
    ...poLineItems.map(({ holdingsRecordId }) => holdingsRecordId),
  ]).filter(Boolean);

  return holdingIds;
};

export const getHoldingIdsFromPOLines = (ky, options = {}) => async (poLines) => {
  return chunk(poLines, 5)
    .reduce(async (acc, poLinesChunk) => {
      const resolvedAcc = await acc;

      const holdingIdsChunk = await Promise.all(poLinesChunk.map(async (poLine) => {
        const poLineHoldingIds = await getHoldingIdsFromPOLine(ky, options)(poLine);

        return poLineHoldingIds;
      }));

      return {
        holdingIds: [
          ...resolvedAcc.holdingIds,
          ...holdingIdsChunk.flat(),
        ],
      };
    }, Promise.resolve({ holdingIds: [] }))
    .then(({ holdingIds: ids }) => uniq(ids));
};
