import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  cloneDeep,
  find,
  sortBy,
} from 'lodash';

import { Callout } from '@folio/stripes/components';

import { getPieceStatusFromItem } from '../../common/utils';
import OpenedRequestsModal from '../../common/OpenedRequestsModal';
import getLocationsForSelect from '../Utils/getLocationsForSelect';
import { fetchItems, fetchRequests } from '../Receiving/util';
import {
  CHECKIN,
  ITEMS,
  LOCATIONS,
  REQUESTS,
} from '../Utils/resources';
import { CHECKIN_URLS } from './const';
import ItemsListModal from './ItemsListModal';
import {
  checkInItems,
  getMixedPieceAndItem,
} from './util';

class CheckInDetails extends Component {
  static manifest = Object.freeze({
    checkIn: CHECKIN,
    items: ITEMS,
    requests: REQUESTS,
    locations: LOCATIONS,
    query: {},
  });

  static propTypes = {
    close: PropTypes.func.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    mutator: PropTypes.object,
    pieces: PropTypes.arrayOf(PropTypes.object).isRequired,
    resources: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.callout = React.createRef();

    this.state = {
      isAllChecked: true,
      isLoading: true,
      items: [],
      isRequestsModalOpened: false,
    };
  }

  componentDidMount() {
    const { mutator, pieces } = this.props;

    Promise.all([fetchRequests(mutator, pieces), fetchItems(mutator, pieces)])
      .then(([requestsMap, itemsMap]) => {
        const items = sortBy(pieces.map(piece => ({
          ...getMixedPieceAndItem(piece, itemsMap),
          itemStatus: getPieceStatusFromItem(itemsMap, piece.itemId),
          request: requestsMap[piece.itemId],
          isChecked: true,
        })), ['locationId']);

        this.setState({
          isLoading: false,
          items,
        });
      });
  }

  toggleItem = (item) => {
    this.setState(state => {
      const items = state.items.map(el => {
        if (el.id === item.id) {
          return {
            ...el,
            isChecked: !el.isChecked,
          };
        }

        return el;
      });

      return {
        isAllChecked: false,
        items,
      };
    });
  };

  toggleAll = () => {
    this.setState((state) => {
      const isAllChecked = !state.isAllChecked;
      const items = state.items.map(item => ({
        ...item,
        isChecked: isAllChecked,
      }));

      return {
        isAllChecked,
        items,
      };
    });
  };

  openCheckinHistory = () => {
    const { mutator, location } = this.props;

    mutator.query.update({
      _path: location.pathname.replace(CHECKIN_URLS.items, CHECKIN_URLS.history),
    });
  };

  openOpenedRequestsModal = () => {
    this.setState({ isRequestsModalOpened: true });
  }

  closeOpenedRequestsModal = () => {
    this.props.close();
    this.setState({ isRequestsModalOpened: false });
    this.openCheckinHistory();
  }

  submitCheckIn = () => {
    const { close, mutator } = this.props;
    const checkInItemsList = this.state.items.filter(item => item.isChecked);

    checkInItems(checkInItemsList, mutator.checkIn)
      .then(() => this.callout.current.sendCallout({
        type: 'success',
        message: <FormattedMessage id="ui-orders.checkIn.checkInItem.success" />,
      }))
      .then(() => {
        if (checkInItemsList.every(piece => !piece.request)) {
          close();
          this.openCheckinHistory();
        } else {
          this.openOpenedRequestsModal();
        }
      })
      .catch(() => this.callout.current.sendCallout({
        type: 'error',
        message: <FormattedMessage id="ui-orders.checkIn.checkInItem.error" />,
      }));
  };

  onChangeField = (item, value, key) => {
    this.setState((state) => {
      const items = cloneDeep(state.items);
      const selectedItem = find(items, { 'id': item.id });

      selectedItem[key] = value;

      return { items };
    });
  };

  render() {
    const { close, resources } = this.props;
    const { isAllChecked, items, isLoading, isRequestsModalOpened } = this.state;

    return (
      <React.Fragment>
        {
          !isRequestsModalOpened && (
            <ItemsListModal
              close={close}
              isAllChecked={isAllChecked}
              isLoading={isLoading}
              items={items}
              locations={getLocationsForSelect(resources)}
              onChangeField={this.onChangeField}
              submitCheckIn={this.submitCheckIn}
              toggleAll={this.toggleAll}
              toggleItem={this.toggleItem}
            />
          )
        }

        <Callout ref={this.callout} />

        {isRequestsModalOpened && (
          <OpenedRequestsModal
            closeModal={this.closeOpenedRequestsModal}
            pieces={items.filter(item => item.isChecked)}
          />
        )}
      </React.Fragment>
    );
  }
}

export default CheckInDetails;
