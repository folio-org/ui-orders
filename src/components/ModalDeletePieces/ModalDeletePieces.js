import React, { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Checkbox,
  Col,
  Loading,
  MessageBanner,
  Modal,
  ModalFooter,
  MultiColumnList,
  Row,
} from '@folio/stripes/components';
import {
  getItemStatusLabel,
  PIECE_FORMAT_LABELS,
} from '@folio/stripes-acq-components';

const visibleColumns = ['checked', 'barcode', 'format', 'request', 'comment', 'location', 'itemStatus'];
const COLUMN_MAPPING = {
  barcode: <FormattedMessage id="ui-orders.receiving.barcode" />,
  format: <FormattedMessage id="ui-orders.receiving.format" />,
  request: <FormattedMessage id="ui-orders.requests.request" />,
  comment: <FormattedMessage id="ui-orders.receiving.comment" />,
  location: <FormattedMessage id="ui-orders.receiving.location" />,
  itemStatus: <FormattedMessage id="ui-orders.receiving.itemStatus" />,
};

const FORMATTER = {
  format: piece => PIECE_FORMAT_LABELS[piece.format],
  barcode: piece => piece.barcode || '-',
  request: piece => (
    piece.request
      ? <FormattedMessage id="ui-orders.requests.request.isOpened" />
      : '-'
  ),
  comment: piece => piece.comment || '-',
  itemStatus: ({ itemStatus }) => getItemStatusLabel(itemStatus),
  location: piece => piece.location || '-',
};

const DeletePiecesFooter = ({ onCancel, onDeletePieces, selectedIds }) => {
  const deletePieces = useCallback(() => {
    onDeletePieces(selectedIds);
  }, [onDeletePieces, selectedIds]);

  return (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        data-test-delete-pieces-delete
        disabled={!selectedIds?.size}
        onClick={deletePieces}
      >
        <FormattedMessage id="ui-orders.deletePiece.btn.deletePiece" />
      </Button>
      <Button
        data-test-delete-pieces-cancel
        onClick={onCancel}
      >
        <FormattedMessage id="ui-orders.deletePiece.btn.cancel" />
      </Button>
    </ModalFooter>
  );
};

DeletePiecesFooter.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onDeletePieces: PropTypes.func.isRequired,
  selectedIds: PropTypes.object,
};

const ModalDeletePieces = ({ isLoading, onCancel, onDeletePieces, pieces }) => {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const isAllChecked = selectedIds.size === pieces?.length;
  const checkAll = useCallback(() => {
    const pieceIds = isAllChecked
      ? []
      : pieces?.map(({ id }) => id);

    setSelectedIds(new Set(pieceIds));
  }, [isAllChecked, pieces]);
  const checkPiece = useCallback(e => {
    const { pieceId } = e.target.dataset;
    const isChecked = selectedIds.has(pieceId);
    const newSelectedIds = new Set(selectedIds);

    if (isChecked) {
      newSelectedIds.delete(pieceId);
    } else {
      newSelectedIds.add(pieceId);
    }

    setSelectedIds(newSelectedIds);
  }, [selectedIds]);
  const columnMapping = useMemo(() => ({
    ...COLUMN_MAPPING,
    checked: (
      <Checkbox
        checked={isAllChecked}
        onChange={checkAll}
      />
    ),
  }), [checkAll, isAllChecked]);
  const formatter = useMemo(() => ({
    ...FORMATTER,
    checked: piece => (
      <Checkbox
        checked={selectedIds.has(piece.id)}
        data-piece-id={piece.id}
        data-test-delete-piece-checked
        onChange={checkPiece}
      />
    ),
  }), [checkPiece, selectedIds]);

  return (
    <Modal
      footer={(
        <DeletePiecesFooter
          onCancel={onCancel}
          onDeletePieces={onDeletePieces}
          selectedIds={selectedIds}
        />
      )}
      id="data-test-delete-pieces-modal"
      label={<FormattedMessage id="ui-orders.deletePiece.title" />}
      open
    >
      <Row>
        <Col xs={12}>
          <MessageBanner type="warning">
            <FormattedMessage id="ui-orders.deletePiece.warning" />
          </MessageBanner>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          {pieces && !isLoading
            ? (
              <MultiColumnList
                columnMapping={columnMapping}
                contentData={pieces}
                formatter={formatter}
                id="delete-pieces-list"
                interactive={false}
                loading={isLoading}
                visibleColumns={visibleColumns}
              />
            )
            : <Loading size="xlarge" />
          }
        </Col>
      </Row>
    </Modal>
  );
};

ModalDeletePieces.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDeletePieces: PropTypes.func.isRequired,
  pieces: PropTypes.arrayOf(PropTypes.object),
};

export default ModalDeletePieces;
