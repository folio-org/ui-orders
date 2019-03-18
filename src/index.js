/* eslint-disable filenames/match-exported */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesShape } from '@folio/stripes/core';

import Main from './routes/Main';
import OrdersSettings from './settings/OrdersSettings';
import {
  RECEIVING_HISTORY,
  RECEIVING_ITEMS,
  ReceivingHistory,
  ReceivingList,
} from './components/Receiving';

/*
  STRIPES-NEW-APP
  This is the main entry point into your new app.
*/

const ORDER_DETAIL_URL = '/orders/view/:id';
const LINE_DETAIL_URL = `${ORDER_DETAIL_URL}/po-line/view/:lineId`;

class Orders extends Component {
  static propTypes = {
    match: ReactRouterPropTypes.match,
    showSettings: PropTypes.bool,
    stripes: stripesShape.isRequired,
    location: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.connectedApp = props.stripes.connect(Main);
    this.connectedReceiving = props.stripes.connect(ReceivingList);
    this.connectedReceivingHistory = props.stripes.connect(ReceivingHistory);
  }

  render() {
    if (this.props.showSettings) {
      return <OrdersSettings {...this.props} />;
    }

    const { match: { path }, stripes } = this.props;

    return (
      <Switch>
        <Route
          exact
          path={`${LINE_DETAIL_URL}${RECEIVING_HISTORY}`}
          render={props => <this.connectedReceivingHistory {...props} stripes={stripes} />}
        />
        <Route
          exact
          path={`${LINE_DETAIL_URL}${RECEIVING_ITEMS}`}
          render={props => <this.connectedReceiving {...props} stripes={stripes} />}
        />
        <Route
          exact
          path={`${ORDER_DETAIL_URL}${RECEIVING_HISTORY}`}
          render={props => <this.connectedReceivingHistory {...props} stripes={stripes} />}
        />
        <Route
          exact
          path={`${ORDER_DETAIL_URL}${RECEIVING_ITEMS}`}
          render={props => <this.connectedReceiving {...props} stripes={stripes} />}
        />
        <Route
          path={path}
          render={props => <this.connectedApp {...props} stripes={stripes} />}
        />
      </Switch>
    );
  }
}

export default Orders;
