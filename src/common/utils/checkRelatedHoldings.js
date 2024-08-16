import get from 'lodash/get';
import uniq from 'lodash/uniq';

import { getConsortiumPiecesAndItemsCountByHoldingIds } from './getConsortiumPiecesAndItemsCountByHoldingIds';
import { getConsortiumPOLineItems } from './getConsortiumPOLineItems';
import { getPiecesAndItemsCountByHoldingIds } from './getPiecesAndItemsCountByHoldingIds';
import { getPOLineItems } from './getPOLineItems';
import { getPOLinePieces } from './getPOLinePieces';

/*
  Checks if holdings contain other pieces and items
  that are not related to the given purchase order line.
*/
export const checkRelatedHoldings = (ky, options = {}) => async (poLine) => {
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

  const {
    holdingsPiecesCount,
    holdingsItemsCount,
    errors,
  } = isCentralOrderingEnabled
    ? await getConsortiumPiecesAndItemsCountByHoldingIds(initPublicationRequest, { signal })(holdingIds, poLine)
    : await getPiecesAndItemsCountByHoldingIds(ky)(holdingIds);

  const relatedToAnother = (
    (holdingsPiecesCount - poLinePieces.length) > 0 || (holdingsItemsCount - poLineItems.length) > 0
  );

  return {
    holdingIds,
    holdingsItemsCount,
    relatedToAnother,
    willAbandoned: Boolean(
      holdingIds.length
        && !relatedToAnother
        && !errors?.pieces?.length
        && !errors?.items?.length,
    ),
  };
};
