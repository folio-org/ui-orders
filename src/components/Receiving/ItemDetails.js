import React, { Component } from 'react';
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

import ItemDetailsFooter from './ItemDetailsFooter';
import css from './ItemDetails.css';

const ITEM_STATUS = {
  received: 'Received',
};

class ItemDetails extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    linesItemList: PropTypes.arrayOf(PropTypes.object).isRequired,
    locationsOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      allChecked: {},
      checkedItems: [],
      currentLine: 0,
      lineItems: this.props.linesItemList,
    };
  }

  isItemChecked = (item) => (
    Boolean(this.state.checkedItems.filter(id => id === item.id).length)
  );

  toggleAll = (poLineId) => {
    this.setState(({ allChecked, checkedItems, lineItems }) => {
      const allCheckedLine = !allChecked[poLineId];
      const itemsToRemove = lineItems[poLineId].map(el => el.id);
      const checkedLineItems = allCheckedLine
        ? [...checkedItems, ...lineItems[poLineId].map(el => el.id)]
        : [...checkedItems].filter(id => !itemsToRemove.includes(id));

      allChecked[poLineId] = allCheckedLine;

      return {
        allChecked,
        checkedItems: checkedLineItems,
      };
    });
  }

  toggleItem = (item) => {
    this.setState(({ allChecked, checkedItems }) => {
      const checkedItemList = checkedItems.filter(id => id !== item.id);

      allChecked[item.poLineId] = false;

      return {
        allChecked,
        checkedItems: this.isItemChecked(item) ? [...checkedItemList] : [...checkedItems, item.id],
      };
    });
  }

  onClickNext = () => (
    this.setState(({ currentLine }) => ({
      currentLine: currentLine + 1,
    }))
  );

  onClickPrevious = () => (
    this.setState(({ currentLine }) => ({
      currentLine: currentLine - 1,
    }))
  );

  onChangeField = (item, value, key) => {
    this.setState(({ lineItems }) => {
      const updatedLineItems = { ...lineItems };
      const selectedItem = updatedLineItems[item.poLineId].filter(el => el.id === item.id)[0];

      selectedItem[key] = value;

      return {
        lineItems: updatedLineItems,
      };
    });
  }

  getResultsFormatter = () => {
    const { locationsOptions } = this.props;

    return ({
      'isChecked': (item) => (
        <Checkbox
          type="checkbox"
          onChange={() => this.toggleItem(item)}
          checked={this.isItemChecked(item)}
        />
      ),
      'barcode': (item) => (
        <div className={css.editableFieldWrapper}>
          <TextField
            onChange={(e) => this.onChangeField(item, e.target.value, 'barcode')}
            type="number"
            value={get(item, 'barcode', '')}
          />
        </div>
      ),
      'format': (item) => <KeyValue value={get(item, 'orderFormat', '')} />,
      'location': (item) => (
        <div className={css.editableFieldWrapper}>
          <Select
            dataOptions={locationsOptions}
            onChange={(e) => this.onChangeField(item, e.target.value, 'locationId')}
            fullWidth
            value={get(item, 'locationId', '')}
          />
        </div>
      ),
      'itemStatus': () => (
        <div className={css.editableFieldWrapper}>
          <Select
            defaultValue={<FormattedMessage id="ui-orders.receiving.itemStatus.received" />}
            fullWidth
          >
            {Object.keys(ITEM_STATUS).map((key) => (
              <FormattedMessage
                id={`ui-orders.receiving.itemStatus.${key}`}
                key={key}
              >
                {(message) => <option value={ITEM_STATUS[key]}>{message}</option>}
              </FormattedMessage>
            ))}
          </Select>
        </div>
      ),
    });
  }

  render() {
    const { close } = this.props;
    const { allChecked, checkedItems, currentLine, lineItems } = this.state;
    const poLineIdsList = Object.keys(lineItems);
    const poLineId = poLineIdsList[currentLine];
    const poLineNumber = get(lineItems, [poLineId, 0, 'poLineNumber'], '');
    const title = get(lineItems, [poLineId, 0, 'title'], '');

    return (
      <Modal
        label={
          (currentLine >= poLineIdsList.length)
            ? <FormattedMessage id="ui-orders.receiving.reviewDetails" />
            : <FormattedMessage id="ui-orders.receiving.modalPaneTitle" values={{ poLineNumber, title }} />
        }
        footer={
          <ItemDetailsFooter
            close={close}
            onClickNext={this.onClickNext}
            onClickPrevious={this.onClickPrevious}
            poLineIdsListLenght={poLineIdsList.length}
            currentLine={currentLine}
            checkedItemsListLength={checkedItems.length}
          />
        }
        open
      >
        {(this.state.currentLine > poLineIdsList.length)
          ? <div>Receive Details</div>
          : (
            <MultiColumnList
              contentData={lineItems[poLineId]}
              formatter={this.getResultsFormatter()}
              visibleColumns={['isChecked', 'barcode', 'format', 'location', 'itemStatus']}
              columnMapping={{
                isChecked: <Checkbox type="checkbox" checked={allChecked[poLineId]} onChange={() => this.toggleAll(poLineId)} />,
                barcode: <FormattedMessage id="ui-orders.receiving.barcode" />,
                format: <FormattedMessage id="ui-orders.receiving.format" />,
                location: <FormattedMessage id="ui-orders.receiving.location" />,
                itemStatus: <FormattedMessage id="ui-orders.receiving.itemStatus" />,
              }}
              columnWidths={{
                isChecked: '5%',
                barcode: '25%',
                format: '20%',
                location: '35%',
                itemStatus: '15%',
              }}
            />
          )
        }
      </Modal>
    );
  }
}

export default ItemDetails;
