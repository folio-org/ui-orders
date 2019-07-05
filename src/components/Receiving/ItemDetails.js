import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  flatten,
  get,
  uniq,
} from 'lodash';

import {
  Callout,
  Modal,
} from '@folio/stripes/components';

import {
  RECEIVING_HISTORY,
  RECEIVING_ITEMS,
} from './ReceivingLinks';
import LineDetails from './LineDetails';
import {
  ITEMS,
  RECEIVE,
} from '../Utils/resources';
import ItemDetailsFooter from './ItemDetailsFooter';
import ReviewDetails from './ReviewDetails';
import { fetchItems, receiveItems } from './util';
import { STATUS_IN_PROCESS } from '../../common/constants';

class ItemDetails extends Component {
  static manifest = Object.freeze({
    items: ITEMS,
    query: {},
    receive: RECEIVE,
  })

  static propTypes = {
    close: PropTypes.func.isRequired,
    linesItemList: PropTypes.object.isRequired,
    location: PropTypes.object,
    locationsOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
    mutator: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.callout = React.createRef();

    this.state = {
      allChecked: {},
      currentLine: 0,
      isLoading: true,
      itemsMap: {},
      lineItems: this.props.linesItemList,
    };
  }

  componentDidMount() {
    const { mutator } = this.props;
    const pieces = flatten(Object.values(this.state.lineItems));

    fetchItems(mutator, pieces).then(itemsMap => this.setState((state) => {
      const lineItems = {};

      Object.entries(state.lineItems).forEach(([k, v]) => {
        lineItems[k] = v.map((piece) => ({
          ...piece,
          barcode: get(itemsMap, [piece.itemId, 'barcode']),
          itemStatus: STATUS_IN_PROCESS,
        }));
      });

      return { lineItems, itemsMap, isLoading: false };
    }));
  }

  isItemChecked = (item) => item.isSelected;

  toggleItem = (item) => {
    this.setState(state => {
      const allChecked = { ...state.allChecked };
      const lineItems = { ...state.lineItems };
      const piece = lineItems[item.poLineId].filter(el => el.id === item.id)[0];

      piece.isSelected = !piece.isSelected;

      const isAllChecked = lineItems[item.poLineId].find(line => !line.isSelected);

      allChecked[item.poLineId] = !isAllChecked;
      allChecked.reviewDetails = false;

      return {
        allChecked,
        lineItems,
      };
    });
  };

  toggleAll = (poLineId) => (
    this.setState(state => {
      const lineItems = { ...state.lineItems };
      const allChecked = { ...state.allChecked };

      if (state.allChecked[poLineId]) {
        lineItems[poLineId].map(item => {
          item.isSelected = false;

          return item;
        });
        allChecked[poLineId] = false;

        return {
          allChecked,
          lineItems,
        };
      } else {
        lineItems[poLineId].map(item => {
          item.isSelected = true;

          return item;
        });
        allChecked[poLineId] = true;

        return {
          allChecked,
          lineItems,
        };
      }
    })
  )

  onClickNext = (linesCounter) => {
    const { close, location, mutator } = this.props;

    if (this.state.currentLine === linesCounter) {
      receiveItems(this.state.lineItems.reviewDetails, mutator.receive)
        .then(() => this.callout.current.sendCallout({
          type: 'success',
          message: <FormattedMessage id="ui-orders.receivingList.receive.success" />,
        }))
        .then(() => close())
        .then(() => mutator.query.update({
          _path: location.pathname.replace(RECEIVING_ITEMS, RECEIVING_HISTORY),
        }))
        .catch(() => this.callout.current.sendCallout({
          type: 'error',
          message: <FormattedMessage id="ui-orders.receivingList.receive.error" />,
        }));
    } else {
      this.setState(state => {
        if (state.currentLine + 1 === linesCounter) {
          const lineItems = { ...state.lineItems };
          const allChecked = { ...state.allChecked };

          lineItems.reviewDetails = uniq(Object.values(lineItems).flat().filter(item => item.isSelected === true), 'id');
          allChecked.reviewDetails = true;

          return {
            allChecked,
            currentLine: state.currentLine + 1,
            lineItems,
          };
        } else {
          return {
            currentLine: state.currentLine + 1,
          };
        }
      });
    }
  }

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

      if (value && key === 'barcode') {
        if (!item.isSelected && value.length > 0) this.toggleItem(item);
      }

      return {
        lineItems: updatedLineItems,
      };
    });
  };

  render() {
    const { close, locationsOptions, linesItemList } = this.props;
    const { allChecked, currentLine, lineItems, isLoading, itemsMap } = this.state;
    const poLineIdsList = Object.keys(linesItemList);
    const poLineId = poLineIdsList[currentLine];
    const poLineNumber = get(lineItems, [poLineId, 0, 'poLineNumber'], '');
    const title = get(lineItems, [poLineId, 0, 'title'], '');
    const isReviewScreen = currentLine >= poLineIdsList.length;

    return (
      <Modal
        id="data-test-piece-details-modal"
        label={
          isReviewScreen
            ? <FormattedMessage id="ui-orders.receiving.reviewDetails" />
            : <FormattedMessage id="ui-orders.receiving.modalPaneTitle" values={{ poLineNumber, title }} />
        }
        footer={
          <ItemDetailsFooter
            close={close}
            currentLine={currentLine}
            lineItems={lineItems}
            onClickNext={this.onClickNext}
            onClickPrevious={this.onClickPrevious}
            poLineIdsListLenght={poLineIdsList.length}
          />
        }
        open
      >
        {isReviewScreen
          ? (
            <ReviewDetails
              allChecked={allChecked}
              checkedItemsList={lineItems.reviewDetails}
              locationsOptions={locationsOptions}
              toggleAll={this.toggleAll}
              toggleItem={this.toggleItem}
            />
          ) : (
            <LineDetails
              allChecked={allChecked}
              isItemChecked={this.isItemChecked}
              isLoading={isLoading}
              itemsMap={itemsMap}
              lineItems={lineItems}
              locationsOptions={locationsOptions}
              onChangeField={this.onChangeField}
              poLineId={poLineId}
              toggleAll={this.toggleAll}
              toggleItem={this.toggleItem}
            />
          )
        }
        <Callout ref={this.callout} />
      </Modal>
    );
  }
}

export default ItemDetails;
