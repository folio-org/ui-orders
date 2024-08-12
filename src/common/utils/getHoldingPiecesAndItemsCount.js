import {
  ITEMS_API,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

export const getHoldingPiecesCount = (ky) => async (holdingId) => {
  const searchParams = {
    query: `holdingId==${holdingId}`,
    limit: 1,
  };

  return ky.get(ORDER_PIECES_API, { searchParams })
    .json()
    .then(({ totalRecords }) => totalRecords);
};

export const getConsortiumHoldingPiecesCount = (initPublicationRequest, { signal, tenants }) => async (holdingId) => {
  const publication = {
    url: `${ORDER_PIECES_API}?query=holdingId==${holdingId}&limit=${1}`,
    method: 'GET',
    tenants: tenants.map(({ id }) => id),
  };

  const { publicationResults } = await initPublicationRequest(publication, { signal });

  return publicationResults.reduce((acc, { response }) => acc + response?.totalRecords, 0);
};

export const getHoldingItemsCount = (ky) => async (holdingId) => {
  const searchParams = {
    query: `holdingsRecordId==${holdingId}`,
    limit: 1,
  };

  return ky.get(ITEMS_API, { searchParams })
    .json()
    .then(({ totalRecords }) => totalRecords);
};

export const getConsortiumHoldingItemsCount = (initPublicationRequest, { signal, tenants }) => async (holdingId) => {
  const publication = {
    url: `${ITEMS_API}?query=holdingsRecordId==${holdingId}&limit=${1}`,
    method: 'GET',
    tenants: tenants.map(({ id }) => id),
  };

  const { publicationResults } = await initPublicationRequest(publication, { signal });

  return publicationResults.reduce((acc, { response }) => acc + response?.totalRecords, 0);
};

export const getHoldingPiecesAndItemsCount = (ky, options = {}) => async (holdingId) => {
  const {
    isCentralOrderingEnabled,
    initPublicationRequest,
    ...restOptions
  } = options;

  const [piecesCount, itemsCount] = await Promise.all(
    isCentralOrderingEnabled
      ? [
        getConsortiumHoldingPiecesCount(initPublicationRequest, restOptions)(holdingId),
        getConsortiumHoldingItemsCount(initPublicationRequest, restOptions)(holdingId),
      ]
      : [
        getHoldingPiecesCount(ky)(holdingId),
        getHoldingItemsCount(ky)(holdingId),
      ],
  );

  return {
    piecesCount,
    itemsCount,
  };
};
