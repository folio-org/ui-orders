import uniq from 'lodash/uniq';

import {
  batchRequest,
  fetchAllRecords,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

const buildQueryByHoldingIds = (itemsChunk) => {
  const query = itemsChunk
    .map(holdingId => `holdingId==${holdingId}`)
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

  const holdingIds = uniq(
    poLinePieces
      ?.map(({ holdingId }) => holdingId)
      ?.filter(Boolean),
  );

  const holdingsPieces = await batchRequest(
    ({ params: searchParams }) => ky.get(ORDER_PIECES_API, { searchParams }).json(),
    holdingIds,
    buildQueryByHoldingIds,
    { limit: 1 },
  );

  const holdingsPiecesCount = holdingsPieces?.reduce((sum, { totalRecords }) => sum + totalRecords, 0);

  return {
    holdingIds,
    relatedToAnother: (holdingsPiecesCount - poLinePieces.length) > 0,
    willAbandoned: (holdingIds.length && (holdingsPiecesCount - poLinePieces.length) === 0),
  };
};
