import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { get } from 'lodash';

import {
  Checkbox,
  KeyValue,
  Modal,
  MultiColumnList,
  Select,
  TextField,
} from '@folio/stripes/components';

import { EMPTY_OPTION } from '../Utils/const';
import ItemsListModalFooter from './ItemsListModalFooter';
import { SelectItemStatus } from '../SelectItemStatus';

import css from './ItemsListModal.css';

const ItemsListModal = ({
  close,
  isAllChecked,
  isLoading,
  items,
  locations,
  onChangeField,
  submitCheckIn,
  toggleAll,
  toggleItem,
}) => {
  const isSelected = ({ item }) => item.isChecked;
  const resultFormatter = {
    'isChecked': (item) => (
      <Checkbox
        checked={item.isChecked}
        onChange={() => toggleItem(item)}
        type="checkbox"
      />
    ),
    'title': (item) => get(item, 'title', ''),
    'piece': (item) => get(item, 'caption', ''),
    'barcode': (item) => (
      <div className={css.fieldWrapper}>
        <TextField
          disabled={isLoading || item.pieceFormat !== 'Physical'}
          onChange={(e) => onChangeField(item, e.target.value, 'barcode')}
          type="text"
          value={item.barcode}
        />
      </div>
    ),
    'format': (item) => (
      <div className={css.fieldWrapper}>
        <KeyValue value={get(item, 'pieceFormat', '')} />
      </div>
    ),
    'location': (item) => (
      <div className={css.fieldWrapper}>
        <Select
          dataOptions={[EMPTY_OPTION, ...locations]}
          fullWidth
          onChange={(e) => onChangeField(item, e.target.value, 'locationId')}
          value={item.locationId}
        />
      </div>
    ),
    'itemStatus': (item) => (
      <SelectItemStatus
        isAssociatedRecord={item.itemId}
        onChange={(e) => onChangeField(item, e.target.value, 'itemStatus')}
      />
    ),
  };

  return (
    <Modal
      id="data-test-check-in-details-modal"
      label={<FormattedMessage id="ui-orders.checkIn.modalPaneTitle" />}
      footer={
        <ItemsListModalFooter
          close={close}
          submit={submitCheckIn}
          isCheckInButtonDisabled={items.filter(item => item.isChecked === true).length}
        />
      }
      open
    >
      <MultiColumnList
        contentData={items}
        formatter={resultFormatter}
        visibleColumns={['isChecked', 'title', 'piece', 'barcode', 'format', 'location', 'itemStatus']}
        columnMapping={{
          isChecked: <Checkbox type="checkbox" checked={isAllChecked} onChange={toggleAll} />,
          title: <FormattedMessage id="ui-orders.receiving.title" />,
          piece: <FormattedMessage id="ui-orders.checkIn.piece" />,
          barcode: <FormattedMessage id="ui-orders.receiving.barcode" />,
          format: <FormattedMessage id="ui-orders.receiving.format" />,
          location: <FormattedMessage id="ui-orders.receiving.location" />,
          itemStatus: <FormattedMessage id="ui-orders.receiving.itemStatus" />,
        }}
        onRowClick={undefined}
        isSelected={isSelected}
      />
    </Modal>
  );
};

ItemsListModal.propTypes = {
  isAllChecked: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChangeField: PropTypes.func.isRequired,
  toggleAll: PropTypes.func.isRequired,
  toggleItem: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  submitCheckIn: PropTypes.func.isRequired,
};

export default ItemsListModal;
