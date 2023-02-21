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

export const getHoldingItemsCount = (ky) => async (holdingId) => {
  const searchParams = {
    query: `holdingsRecordId==${holdingId}`,
    limit: 1,
  };

  return ky.get(ITEMS_API, { searchParams })
    .json()
    .then(({ totalRecords }) => totalRecords);
};

export const getHoldingPiecesAndItemsCount = (ky) => async (holdingId) => {
  const [piecesCount, itemsCount] = await Promise.all([
    getHoldingPiecesCount(ky)(holdingId),
    getHoldingItemsCount(ky)(holdingId),
  ]);

  return {
    piecesCount,
    itemsCount,
  };
};
