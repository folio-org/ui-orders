import React, { useEffect, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  batchFetch,
  itemsResource,
  locationsManifest,
  pieceResource,
  piecesResource,
  requestsResource,
  useShowCallout,
} from '@folio/stripes-acq-components';

import ModalDeletePieces from './ModalDeletePieces';
import { getHydratedPieces } from './getHydratedPieces';

const ModalDeletePiecesContainer = ({ mutator, onCancel, poLines }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mmutator = useMemo(() => mutator, []);
  const [pieces, setPieces] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const showCallout = useShowCallout();

  useEffect(
    () => {
      if (poLines?.length) {
        batchFetch(mmutator.linePieces, poLines, (itemsChunk) => {
          const query = itemsChunk
            .map(({ id }) => `poLineId==${id}`)
            .join(' or ');

          return query ? `(${query}) sortby locationId` : '';
        })
          .then(piecesResp => getHydratedPieces(piecesResp, mmutator.requests, mmutator.items, mmutator.pieceLocations))
          .then(setPieces)
          .then(() => setIsLoading(false));
      }
    },
    [mmutator.items, mmutator.linePieces, mmutator.pieceLocations, mmutator.requests, poLines],
  );

  const onDeletePieces = useCallback((selectedIds) => {
    setIsLoading(true);
    Promise.all(Array.from(selectedIds || []).map(id => mmutator.deletePiece.DELETE({ id }, { silent: true })))
      .then(
        () => showCallout({ message: <FormattedMessage id="ui-orders.deletePiece.delete.success" /> }),
        errorResponse => {
          const messageId = errorResponse?.includes('thereAreRequestsOnItem') ? 'thereAreRequestsOnItem' : 'fail';

          showCallout({
            message: <FormattedMessage id={`ui-orders.deletePiece.delete.${messageId}`} />,
            type: 'error',
          });
        },
      )
      .finally(onCancel);
  }, [mmutator.deletePiece, onCancel, showCallout]);

  return (
    <ModalDeletePieces
      isLoading={Boolean(isLoading)}
      onCancel={onCancel}
      onDeletePieces={onDeletePieces}
      pieces={pieces}
    />
  );
};

ModalDeletePiecesContainer.manifest = Object.freeze({
  deletePiece: pieceResource,
  items: itemsResource,
  linePieces: piecesResource,
  pieceLocations: locationsManifest,
  requests: requestsResource,
});

ModalDeletePiecesContainer.propTypes = {
  poLines: PropTypes.arrayOf(PropTypes.object),
  onCancel: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(ModalDeletePiecesContainer);
