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
import { getItemStatusLabel } from '../../common/constants';
import CenteredRowFormatter from '../../common/CenteredRowFormatter';

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
      <TextField
        disabled={isLoading || item.pieceFormat !== 'Physical'}
        onChange={(e) => onChangeField(item, e.target.value, 'barcode')}
        type="text"
        value={item.barcode}
        marginBottom0
      />
    ),
    'hasRequest': (item) => Boolean(item.request) && <FormattedMessage id="ui-orders.requests.request.isOpened" />,
    'format': (item) => (
      <KeyValue value={get(item, 'pieceFormat', '')} />
    ),
    'location': (item) => (
      <Select
        dataOptions={[EMPTY_OPTION, ...locations]}
        fullWidth
        onChange={(e) => onChangeField(item, e.target.value, 'locationId')}
        value={item.locationId}
        marginBottom0
      />
    ),
    'itemStatus': (item) => getItemStatusLabel(item.itemStatus),
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
        visibleColumns={['isChecked', 'title', 'piece', 'barcode', 'hasRequest', 'format', 'location', 'itemStatus']}
        columnMapping={{
          isChecked: <Checkbox type="checkbox" checked={isAllChecked} onChange={toggleAll} />,
          title: <FormattedMessage id="ui-orders.receiving.title" />,
          piece: <FormattedMessage id="ui-orders.checkIn.piece" />,
          barcode: <FormattedMessage id="ui-orders.receiving.barcode" />,
          hasRequest: <FormattedMessage id="ui-orders.requests.request" />,
          format: <FormattedMessage id="ui-orders.receiving.format" />,
          location: <FormattedMessage id="ui-orders.receiving.location" />,
          itemStatus: <FormattedMessage id="ui-orders.receiving.itemStatus" />,
        }}
        onRowClick={undefined}
        isSelected={isSelected}
        interactive={false}
        selectedClass="noClass"
        rowFormatter={CenteredRowFormatter}
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
