/* eslint-disable filenames/match-exported */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
} from 'react-router-dom';
import { hot } from 'react-hot-loader';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesShape } from '@folio/stripes/core';

import { LayerPO, LayerPOLine } from './components/LayerCollection';
import OrdersList from './OrdersList';
import OrderLinesList from './OrderLinesList';
import OrdersSettings from './settings/OrdersSettings';
import {
  NOTES_ROUTE,
  ORDER_CREATE_ROUTE,
  ORDER_EDIT_ROUTE,
  ORDER_LINE_CREATE_ROUTE,
  ORDER_LINE_EDIT_ROUTE,
  ORDER_LINES_ROUTE,
} from './common/constants';
import { Notes } from './common/Notes';

const Orders = ({ match, location, showSettings }) => {
  const { path } = match;
  const content = showSettings
    ? <OrdersSettings {...{ match, location }} />
    : (
      <Switch>
        <Route
          path={ORDER_LINE_CREATE_ROUTE}
          component={LayerPOLine}
        />
        <Route
          path={ORDER_LINE_EDIT_ROUTE}
          component={LayerPOLine}
        />
        <Route
          path={ORDER_CREATE_ROUTE}
          component={LayerPO}
        />
        <Route
          path={ORDER_EDIT_ROUTE}
          component={LayerPO}
        />
        <Route
          path={ORDER_LINES_ROUTE}
          component={OrderLinesList}
        />
        <Route
          path={NOTES_ROUTE}
          component={Notes}
        />
        <Route
          path={path}
          component={OrdersList}
        />
      </Switch>
    );

  return content;
};

Orders.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  showSettings: PropTypes.bool,
  stripes: stripesShape.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default hot(module)(Orders);
