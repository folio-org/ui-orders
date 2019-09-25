import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Checkbox,
  MultiColumnList,
} from '@folio/stripes/components';
import { FolioFormattedDate } from '@folio/stripes-acq-components';

const VISIBLE_COLUMNS = ['isChecked', 'title', 'piece', 'format', 'supplement', 'poLineNumber', 'comment', 'pieceStatus'];

const PiecesList = ({ renderActions, checkedItemsMap, items = [], toggleItem, toggleAll, isAllChecked = false }) => {
  const isSelected = ({ item }) => checkedItemsMap[item.id];
  const resultsFormatter = {
    'isChecked': piece => (
      <Checkbox
        checked={!!checkedItemsMap[piece.id]}
        type="checkbox"
        onChange={() => toggleItem(piece)}
      />
    ),
    'title': piece => piece.title,
    'piece': piece => piece.caption,
    'format': piece => piece.pieceFormat,
    'supplement': piece => (
      <Checkbox
        checked={piece.supplement}
        disabled
        type="checkbox"
      />
    ),
    'poLineNumber': piece => piece.poLineNumber,
    'comment': piece => piece.comment,
    'pieceStatus': piece => piece.receivingStatus,
    'expectedReceiptDate': piece => <FolioFormattedDate value={piece.receivedDate} />,
    'actions': renderActions,
  };
  const visibleColumns = renderActions ? [...VISIBLE_COLUMNS, 'expectedReceiptDate', 'actions'] : VISIBLE_COLUMNS;

  return (
    <MultiColumnList
      contentData={items}
      formatter={resultsFormatter}
      visibleColumns={visibleColumns}
      columnMapping={{
        isChecked: (
          <Checkbox
            name="isAllChecked"
            checked={isAllChecked}
            type="checkbox"
            onChange={toggleAll}
          />
        ),
        title: <FormattedMessage id="ui-orders.receiving.title" />,
        piece: <FormattedMessage id="ui-orders.checkIn.piece" />,
        format: <FormattedMessage id="ui-orders.checkIn.pieceFormat" />,
        supplement: <FormattedMessage id="ui-orders.checkIn.supplement" />,
        poLineNumber: <FormattedMessage id="ui-orders.receiving.poLine" />,
        comment: <FormattedMessage id="ui-orders.checkIn.comment" />,
        pieceStatus: <FormattedMessage id="ui-orders.checkIn.pieceStatus" />,
        expectedReceiptDate: <FormattedMessage id="ui-orders.checkIn.expectedReceiptDate" />,
        actions: null,
      }}
      onRowClick={undefined}
      isSelected={isSelected}
    />
  );
};

PiecesList.propTypes = {
  checkedItemsMap: PropTypes.object,
  isAllChecked: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object),
  toggleAll: PropTypes.func.isRequired,
  toggleItem: PropTypes.func.isRequired,
  renderActions: PropTypes.func,
};

export default PiecesList;
