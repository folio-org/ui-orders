import uniq from 'lodash/uniq';

import {
  fetchAllRecords,
  ITEMS_API,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

import { getPiecesAndItemsByHoldingIds } from './getPiecesAndItemsByHoldingIds';

/*
  Checks if holdings contain other pieces and items
  that are not related to the given purchase order line (synchronized).
*/
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
