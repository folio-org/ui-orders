import React, { Component } from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';

import {
  IfPermission,
} from '@folio/stripes/core';

import {
  ORDER_LINE_VIEW_ROUTE,
  ORDER_VIEW_ROUTE,
} from '../../common/constants';
import { PO } from '../PurchaseOrder';
import { POLine } from '../POLine';

class Panes extends Component {
  static propTypes = {
    match: ReactRouterPropTypes.match,
    refreshList: PropTypes.func.isRequired,
  }

  render() {
    const { match: { url }, refreshList } = this.props;

    return (
      <Switch>
        <Route
          exact
          path={ORDER_VIEW_ROUTE}
          render={props => (
            <PO
              {...props}
              refreshList={refreshList}
            />
          )}
        />
        <IfPermission perm="orders.po-lines.item.get">
          <Route
            exact
            path={ORDER_LINE_VIEW_ROUTE}
            render={
              props => (
                <POLine
                  poURL={url}
                  {...props}
                />
              )
            }
          />
        </IfPermission>
      </Switch>
    );
  }
}

export default Panes;
