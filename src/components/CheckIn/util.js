import {
  get,
  some,
} from 'lodash';

export const checkInItems = (pieces, mutator) => {
  const linesMap = {};

  pieces.forEach(piece => {
    const item = {
      id: piece.id,
      barcode: piece.barcode,
      comment: piece.comment,
      caption: piece.caption,
      supplement: piece.supplement,
      locationId: piece.locationId || null,
      itemStatus: piece.itemStatus,
    };
    const line = linesMap[piece.poLineId];

    if (line) {
      line.checkedIn += 1;
      line.checkInPieces.push(item);
    } else {
      linesMap[piece.poLineId] = {
        poLineId: piece.poLineId,
        checkedIn: 1,
        checkInPieces: [item],
      };
    }
  });

  const postData = {
    toBeCheckedIn: Object.values(linesMap),
    totalRecords: pieces.length,
  };

  return mutator.POST(postData).then(({ receivingResults }) => {
    if (some(receivingResults, ({ processedWithError }) => processedWithError > 0)) {
      return Promise.reject(receivingResults);
    }

    return receivingResults;
  });
};

export const getMixedPieceAndItem = (piece, itemsMap) => ({
  ...piece,
  barcode: get(itemsMap, [piece.itemId, 'barcode'], ''),
});
