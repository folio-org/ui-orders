import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { get, debounce } from 'lodash';

import {
  Button,
  Callout,
  Checkbox,
  Col,
  ConfirmationModal,
  IconButton,
  MultiColumnList,
  Pane,
  PaneMenu,
  Paneset,
  Row,
  SearchField,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import { FolioFormattedTime } from '@folio/stripes-acq-components';

import {
  ITEMS,
  ORDER,
  RECEIVE,
  RECEIVING_HISTORY as RECEIVING_HISTORY_RESOURCE,
} from '../Utils/resources';
import ReceivingLinks, { RECEIVING_HISTORY } from './ReceivingLinks';
import { PIECE_STATUS_RECEIVED } from './const';
import {
  fetchItems,
  historyRemoveItems,
  reducePieces,
} from './util';

const RECEIVING_HISTORY_LIMIT = 25;

class ReceivingHistory extends Component {
  static manifest = Object.freeze({
    query: {},
    receivingHistory: RECEIVING_HISTORY_RESOURCE,
    order: ORDER,
    receive: RECEIVE,
    items: ITEMS,
  })

  static propTypes = {
    location: ReactRouterPropTypes.location,
    mutator: PropTypes.object,
    resources: PropTypes.object,
    match: ReactRouterPropTypes.match,
  }

  constructor(props) {
    super(props);
    this.callout = React.createRef();

    this.receivingHistoryOffset = 0;
  }

  state = {
    checkedPiecesMap: {},
    confirming: false,
    isAllChecked: false,
    pieces: [],
    searchText: '',
  };

  componentDidMount() {
    const { mutator } = this.props;

    mutator.receivingHistory.reset();
    this.fetchHistory();
  }

  fetchHistory = () => {
    const { mutator, match: { params: { id, lineId } } } = this.props;
    const { searchText } = this.state;
    const params = {
      offset: this.receivingHistoryOffset || 0,
      limit: RECEIVING_HISTORY_LIMIT,
      query: `(title=="*${searchText}*") and checkin == false and receivingStatus==${PIECE_STATUS_RECEIVED} and purchaseOrderId==${id}${lineId ? ` and poLineId==${lineId}` : ''}`,
    };
    let piecesFromHistory = null;

    mutator.receivingHistory.GET({ params })
      .then(piecesResponse => {
        piecesFromHistory = piecesResponse;

        return fetchItems(mutator, piecesResponse);
      })
      .then(itemsMap => {
        const pieces = piecesFromHistory.map((piece) => ({
          ...piece,
          barcode: get(itemsMap, [piece.itemId, 'barcode']),
        }));

        this.setState(prevState => ({
          pieces: [...prevState.pieces, ...pieces],
        }));
      });

    this.receivingHistoryOffset += RECEIVING_HISTORY_LIMIT;
  }

  updateReceivingHistory = () => {
    const { mutator } = this.props;

    mutator.receivingHistory.reset();
    this.setState({ pieces: [] });
    this.receivingHistoryOffset = 0;

    this.fetchHistory();
  }

  onCloseReceiving = () => {
    const { location, mutator } = this.props;

    mutator.query.update({
      _path: location.pathname.replace(RECEIVING_HISTORY, ''),
    });
  }

  getFirstMenu = () => (
    <PaneMenu>
      <FormattedMessage id="ui-orders.buttons.line.close">
        {(title) => (
          <IconButton
            ariaLabel={title}
            data-test-close-button
            icon="times"
            onClick={this.onCloseReceiving}
          />
        )}
      </FormattedMessage>
    </PaneMenu>
  );

  toggleItem = (piece) => {
    const { id } = piece;

    this.setState(({ checkedPiecesMap }) => {
      const newValue = checkedPiecesMap[id] ? null : piece;

      return {
        checkedPiecesMap: {
          ...checkedPiecesMap,
          [id]: newValue,
        },
      };
    });
  }

  toggleAll = () => {
    this.setState((state) => {
      const isAllChecked = !state.isAllChecked;
      const checkedPiecesMap = reducePieces(state.pieces, isAllChecked);

      return {
        checkedPiecesMap,
        isAllChecked,
      };
    });
  }

  changeSearchText = (event) => {
    const searchText = get(event, 'target.value', '');

    this.setState({ searchText });
    this.updateOnFilter();
  }

  updateOnFilter = debounce(this.updateReceivingHistory, 1000);

  showConfirm = () => this.setState({ confirming: true });

  hideConfirm = () => this.setState({ confirming: false });

  handleSubmit = () => {
    this.hideConfirm();
    historyRemoveItems(this.state.checkedPiecesMap, this.props.mutator.receive)
      .then(() => this.callout.current.sendCallout({
        type: 'success',
        message: <FormattedMessage id="ui-orders.receivingHistory.remove.success" />,
      }))
      .catch(() => this.callout.current.sendCallout({
        type: 'error',
        message: <FormattedMessage id="ui-orders.receivingHistory.remove.error" />,
      }))
      .then(this.updateReceivingHistory);
  }

  render() {
    const { checkedPiecesMap, confirming, isAllChecked, searchText, pieces } = this.state;
    const { mutator, location, resources } = this.props;
    const orderNumber = get(resources, ['order', 'records', 0, 'poNumber']);
    const isRemoveButtonDisabled = Object.values(checkedPiecesMap).filter(Boolean).length === 0;
    const resultsFormatter = {
      'isChecked': (piece) => (
        <Checkbox
          type="checkbox"
          checked={Boolean(checkedPiecesMap[piece.id])}
          onClick={() => this.toggleItem(piece)}
        />
      ),
      'title': piece => get(piece, 'title', ''),
      'poLineNumber': piece => get(piece, 'poLineNumber', ''),
      'dateOrdered': piece => <FolioFormattedTime dateString={get(piece, 'dateOrdered')} />,
      'dateReceived': piece => <FolioFormattedTime dateString={get(piece, 'receivedDate')} />,
      'comment': piece => get(piece, 'comment', ''),
      'barcode': piece => (
        <span data-test-piece-barcode>
          {get(piece, 'barcode', '')}
        </span>
      ),
      'receivingNote': piece => get(piece, 'receivingNote', ''),
      'receivingStatus': piece => get(piece, 'receivingStatus', ''),
    };

    return (
      <div data-test-receiving-history>
        <Paneset>
          <Pane
            defaultWidth="fill"
            paneTitle={(
              <FormattedMessage
                id="ui-orders.receivingHistory.paneTitle"
                values={{ orderNumber }}
              />
            )}
            firstMenu={this.getFirstMenu()}
          >
            <Row center="xs">
              <Col xs>
                <ReceivingLinks
                  location={location}
                  mutator={mutator}
                />
              </Col>
            </Row>
            <Row end="xs">
              <Col data-test-receiving-history-search>
                <SearchField
                  marginBottom0
                  onChange={this.changeSearchText}
                  onClear={this.changeSearchText}
                  value={searchText}
                />
              </Col>
              <Col>
                <Button
                  buttonStyle="primary"
                  data-test-receiving-remove
                  disabled={isRemoveButtonDisabled}
                  marginBottom0
                  onClick={this.showConfirm}
                >
                  <FormattedMessage id="ui-orders.receiving.btn.remove" />
                </Button>
              </Col>
            </Row>
            <MultiColumnList
              onNeedMoreData={this.fetchHistory}
              virtualize
              height={450}
              fullWidth
              formatter={resultsFormatter}
              contentData={pieces}
              columnMapping={{
                isChecked: <Checkbox type="checkbox" checked={isAllChecked} onChange={this.toggleAll} />,
                title: <FormattedMessage id="ui-orders.receiving.title" />,
                poLineNumber: <FormattedMessage id="ui-orders.receiving.poLine" />,
                dateOrdered: <FormattedMessage id="ui-orders.receiving.dateOrdered" />,
                dateReceived: <FormattedMessage id="ui-orders.receivingHistory.dateReceived" />,
                comment: <FormattedMessage id="ui-orders.receiving.comment" />,
                barcode: <FormattedMessage id="ui-orders.receiving.barcode" />,
                receivingNote: <FormattedMessage id="ui-orders.receivingHistory.note" />,
                receivingStatus: <FormattedMessage id="ui-orders.receiving.status" />,
              }}
              columnWidths={{ isChecked: 35, comment: '15%' }}
              visibleColumns={['isChecked', 'title', 'poLineNumber', 'dateOrdered', 'dateReceived', 'barcode', 'comment', 'receivingNote', 'receivingStatus']}
            />
          </Pane>
        </Paneset>
        {confirming && (
          <ConfirmationModal
            confirmLabel={<FormattedMessage id="ui-orders.receivingHistory.confirmation.confirm" />}
            heading={<FormattedMessage id="ui-orders.receivingHistory.confirmation.heading" />}
            message={<FormattedMessage id="ui-orders.receivingHistory.confirmation.message" />}
            onCancel={this.hideConfirm}
            onConfirm={this.handleSubmit}
            open
          />
        )}
        <Callout ref={this.callout} />
      </div>
    );
  }
}

export default stripesConnect(ReceivingHistory);
