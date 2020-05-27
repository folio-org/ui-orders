import { map } from 'lodash';

import {
  batchFetch,
  ITEM_STATUS,
} from '@folio/stripes-acq-components';

const getPieceStatusFromItem = (item) => {
  const itemStatus = item?.status?.name || ITEM_STATUS.undefined;

  return itemStatus;
};

export function getHydratedPieces(pieces, mutatorRequests, mutatorItems, mutatorLocations) {
  const locationsPromise = batchFetch(mutatorLocations, map(pieces, 'locationId').filter(Boolean));
  const itemsIds = pieces.filter(({ itemId }) => itemId).map(({ itemId }) => itemId);
  const itemsPromise = batchFetch(mutatorItems, itemsIds);
  const requestsPromise = batchFetch(mutatorRequests, pieces, (piecesChunk) => {
    const itemIdsQuery = piecesChunk
      .filter(piece => piece.itemId)
      .map(piece => `itemId==${piece.itemId}`)
      .join(' or ');

    return itemIdsQuery ? `(${itemIdsQuery}) and status="Open*"` : '';
  });

  return Promise.all([itemsPromise, requestsPromise, pieces, locationsPromise])
    .then(([itemsResponse, requestsResponse, piecesResponse, locationsResponse]) => {
      const itemsMap = itemsResponse.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
      const requestsMap = requestsResponse.reduce((acc, r) => ({ ...acc, [r.itemId]: r }), {});
      const locationsMap = locationsResponse.reduce((acc, r) => ({ ...acc, [r.id]: `${r.name} (${r.code})` }), {});

      return piecesResponse.map((piece) => ({
        ...piece,
        barcode: itemsMap[piece.itemId]?.barcode,
        callNumber: itemsMap[piece.itemId]?.itemLevelCallNumber,
        itemStatus: getPieceStatusFromItem(itemsMap[piece.itemId]),
        location: locationsMap[piece.locationId],
        request: requestsMap[piece.itemId],
      }));
    });
}
