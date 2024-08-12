import queryString from 'query-string';

import {
  batchRequest,
  ITEMS_API,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';
import { getConsortiumPOLineLocationTenants } from './getConsortiumPOLineLocationTenants';

const PIECE = 'piece';
const ITEM = 'item';

const buildQueryByHoldingIds = (key) => (itemsChunk) => {
  return itemsChunk.length
    ? `${key === ITEM ? 'holdingsRecordId' : 'holdingId'}==(${itemsChunk.join(' or ')})`
    : '';
};

const calculateRecordsCount = (results) => results.reduce((sum, { publicationResults }) => {
  return publicationResults.reduce((acc, { response }) => acc + response?.totalRecords || 0, sum);
}, 0);

export const getConsortiumPiecesAndItemsCountByHoldingIds = (initPublicationRequest, { signal }) => {
  return async (holdingIds, poLine) => {
    const tenants = getConsortiumPOLineLocationTenants(poLine);

    const piecesResponses = await batchRequest(
      ({ params }) => (
        initPublicationRequest({
          url: `${ORDER_PIECES_API}?${queryString.stringify(params, { encode: false })}`,
          method: 'GET',
          tenants,
        }, { signal })
      ),
      holdingIds,
      buildQueryByHoldingIds(PIECE),
      { limit: 1 },
    );

    const itemsResponses = await batchRequest(
      ({ params }) => (
        initPublicationRequest({
          url: `${ITEMS_API}?${queryString.stringify(params, { encode: false })}`,
          method: 'GET',
          tenants,
        }, { signal })
      ),
      holdingIds,
      buildQueryByHoldingIds(ITEM),
      { limit: 1 },
    );

    const holdingsPiecesCount = calculateRecordsCount(piecesResponses);
    const holdingsItemsCount = calculateRecordsCount(itemsResponses);

    return {
      holdingsPiecesCount,
      holdingsItemsCount,
      errors: {
        pieces: piecesResponses.flatMap(({ publicationErrors }) => publicationErrors),
        items: itemsResponses.flatMap(({ publicationErrors }) => publicationErrors),
      },
    };
  };
};
