import { useCallback } from 'react';
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
  ORDER_LINE_VIEW_VERSIONS_ROUTE,
  ORDER_VIEW_ROUTE,
  ORDER_VIEW_VERSIONS_ROUTE,
} from '../../common/constants';
import {
  PO,
  POVersionView,
} from '../PurchaseOrder';
import {
  POLine,
  POLineVersionView,
} from '../POLine';

const Panes = ({
  match: { url },
  refreshList,
}) => {
  const renderOrderDetails = useCallback((props) => (
    <PO
      {...props}
      refreshList={refreshList}
    />
  ), [refreshList]);

  const renderOrderLineDetails = useCallback((props) => (
    <POLine
      poURL={url}
      {...props}
    />
  ), [url]);

  return (
    <Switch>
      <Route
        exact
        path={ORDER_VIEW_ROUTE}
        render={renderOrderDetails}
      />

      <Route
        exact
        path={ORDER_VIEW_VERSIONS_ROUTE}
        component={POVersionView}
      />

      <IfPermission perm="orders.po-lines.item.get">
        <Route
          exact
          path={ORDER_LINE_VIEW_ROUTE}
          render={renderOrderLineDetails}
        />

        <Route
          exact
          path={ORDER_LINE_VIEW_VERSIONS_ROUTE}
          component={POLineVersionView}
        />
      </IfPermission>
    </Switch>
  );
};

Panes.propTypes = {
  history: ReactRouterPropTypes.history,
  location: ReactRouterPropTypes.location,
  match: ReactRouterPropTypes.match,
  refreshList: PropTypes.func.isRequired,
};

export default Panes;
