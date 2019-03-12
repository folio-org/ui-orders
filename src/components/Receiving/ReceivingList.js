import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  get,
  some,
  sortBy,
  uniqBy,
} from 'lodash';

import {
  Button,
  Checkbox,
  Col,
  IconButton,
  MultiColumnList,
  Pane,
  PaneMenu,
  Paneset,
  Row,
} from '@folio/stripes/components';

import { EXTENDED_MUTATOR } from '../Utils/mutators';
import getLocationsForSelect from '../Utils/getLocationsForSelect';
import {
  LOCATIONS,
  RECEIVING_HISTORY,
} from '../Utils/resources';
import { LIMIT_MAX } from '../Utils/const';
import FolioFormattedTime from '../FolioFormattedTime';
import ItemDetails from './ItemDetails';
import {
  PIECE_STATUS_RECEIVED,
  PIECE_STATUS_EXPECTED,
} from './const';
import ReceivingLinks from './ReceivingLinks';

const getLinesRows = (receivingList) => {
  let uniqReceivingList = sortBy(uniqBy(receivingList, 'poLineId'), 'poLineNumber');

  uniqReceivingList = uniqReceivingList.map((line) => {
    const itemsToReceive = receivingList.filter(el => el.poLineId === line.poLineId);
    const receivedItemsCount = itemsToReceive.filter(el => el.receivingStatus === PIECE_STATUS_RECEIVED).length;
    const itemsToReceiveCount = itemsToReceive.length;

    if (receivedItemsCount === itemsToReceiveCount) {
      return null;
    }

    line.received = `${receivedItemsCount}/${itemsToReceiveCount}`;

    return line;
  });

  return uniqReceivingList.filter(Boolean);
};

class ReceivingList extends Component {
  static manifest = Object.freeze({
    query: {
      initialValue: {
        query: '',
      },
    },
    receivingHistory: RECEIVING_HISTORY,
    locations: LOCATIONS,
  })

  static propTypes = {
    resources: PropTypes.object,
    location: ReactRouterPropTypes.location.isRequired,
    mutator: PropTypes.shape({
      query: PropTypes.shape({
        update: PropTypes.func.isRequired,
      }),
      receiving_history: EXTENDED_MUTATOR,
    }).isRequired,
    match: ReactRouterPropTypes.match.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      isAllChecked: false,
      itemDetails: {},
      isItemDetailsModalOpened: false,
    };
  }

  componentDidMount() {
    const { mutator: { receivingHistory }, match: { params: { id, lineId } } } = this.props;
    const params = {
      limit: LIMIT_MAX,
      query: `purchaseOrderId==${id}${lineId ? ` and poLineId==${lineId}` : ''}`,
    };

    receivingHistory.reset();
    receivingHistory.GET({ params });
  }

  onCloseReceiving = () => {
    const { location, mutator } = this.props;

    mutator.query.update({
      _path: location.pathname.replace('/receiving', ''),
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

  isLineChecked = (line) => (
    this.state.itemDetails[line.poLineId]
      ? Boolean(this.state.itemDetails[line.poLineId].length)
      : false
  )

  toggleLine = (line, receivingList) => {
    this.setState(({ itemDetails }) => ({
      isAllChecked: false,
      itemDetails: {
        ...itemDetails,
        ...{
          [line.poLineId]: this.isLineChecked(line)
            ? []
            : receivingList.filter(el => (
              el.poLineId === line.poLineId && el.receivingStatus === PIECE_STATUS_EXPECTED
            )),
        },
      },
    }));
  }

  toggleAll = (receivingList) => {
    this.setState((state) => {
      const isAllChecked = !state.isAllChecked;
      const itemDetails = {};

      if (isAllChecked) {
        receivingList.forEach((piece) => {
          const poLineId = piece.poLineId;
          const linePieces = itemDetails[poLineId];

          if (piece.receivingStatus === PIECE_STATUS_EXPECTED) {
            if (linePieces) {
              linePieces.push(piece);
            } else {
              itemDetails[poLineId] = [piece];
            }
          }
        });
      }

      return {
        isAllChecked,
        itemDetails,
      };
    });
  }

  openItemDetailsModal = () => {
    this.setState({ isItemDetailsModalOpened: true });
  }

  closeItemDetailsModal = () => {
    this.setState({ isItemDetailsModalOpened: false });
  }

  getItemDetails = () => {
    const { itemDetails } = this.state;

    Object.keys(itemDetails).forEach(key => !itemDetails[key].length && delete itemDetails[key]);

    return itemDetails;
  }

  render() {
    const { resources, mutator, location } = this.props;
    const receivingList = get(resources, ['receivingHistory', 'records'], []);
    const uniqReceivingList = getLinesRows(receivingList);
    const orderNumber = get(resources, ['receivingHistory', 'records', 0, 'poLineNumber'], '-').split('-')[0];
    const resultsFormatter = {
      'isChecked': line => (
        <Checkbox
          type="checkbox"
          checked={this.isLineChecked(line)}
          onChange={() => this.toggleLine(line, receivingList)}
        />
      ),
      'poLineNumber': line => get(line, 'poLineNumber', ''),
      'title': line => get(line, 'title', ''),
      'received': line => line.received,
      'dateOrdered': line => <FolioFormattedTime dateString={get(line, 'dateOrdered')} />,
      'receivingNote': line => get(line, 'receivingNote', ''),
      'receiptStatus': () => <FormattedMessage id="ui-orders.receiving.lineStatus.expected" />,
    };
    const isReceiveButtonDisabled = !some(Object.values(this.state.itemDetails), (line => line.length > 0));

    return (
      <div data-test-receiving>
        <Paneset>
          <Pane
            defaultWidth="fill"
            paneTitle={(
              <FormattedMessage
                id="ui-orders.receivingList.paneTitle"
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
              <Col xs>
                <Button
                  buttonStyle="primary"
                  disabled={isReceiveButtonDisabled}
                  onClick={this.openItemDetailsModal}
                  data-test-receive-pieces-button
                >
                  <FormattedMessage id="ui-orders.receiving.receiveBtn" />
                </Button>
              </Col>
            </Row>
            <MultiColumnList
              contentData={uniqReceivingList}
              formatter={resultsFormatter}
              visibleColumns={['isChecked', 'poLineNumber', 'title', 'received', 'dateOrdered', 'receivingNote', 'receiptStatus']}
              columnMapping={{
                isChecked: <Checkbox type="checkbox" checked={this.state.isAllChecked} onChange={() => this.toggleAll(receivingList)} />,
                poLineNumber: <FormattedMessage id="ui-orders.receiving.poLine" />,
                title: <FormattedMessage id="ui-orders.receiving.title" />,
                received: <FormattedMessage id="ui-orders.receiving.received" />,
                dateOrdered: <FormattedMessage id="ui-orders.receiving.dateOrdered" />,
                receivingNote: <FormattedMessage id="ui-orders.receiving.note" />,
                receiptStatus: <FormattedMessage id="ui-orders.receiving.status" />,
              }}
              columnWidths={{ isChecked: '35px' }}
            />
            {this.state.isItemDetailsModalOpened && (
              <ItemDetails
                linesItemList={this.getItemDetails()}
                close={this.closeItemDetailsModal}
                locationsOptions={getLocationsForSelect(resources)}
              />
            )}
          </Pane>
        </Paneset>
      </div>
    );
  }
}

export default ReceivingList;
