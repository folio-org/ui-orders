import {
  Route,
  Switch,
} from 'react-router-dom';

import {
  RoutingListCreate,
  RoutingListEdit,
  RoutingListView,
} from '@folio/stripes-acq-components';

import { ROUTING_LIST_ROUTE } from '../../../common/constants';
import {
  ROUTING_LIST_CREATE_ROUTE,
  ROUTING_LIST_EDIT_ROUTE,
  ROUTING_LIST_VIEW_ROUTE,
} from './constants';

export function RoutingList() {
  return (
    <Switch>
      <Route
        path={ROUTING_LIST_CREATE_ROUTE}
        component={RoutingListCreate}
      />
      <Route
        path={ROUTING_LIST_VIEW_ROUTE}
        render={() => <RoutingListView routingListUrl={ROUTING_LIST_ROUTE} />}
      />
      <Route
        path={ROUTING_LIST_EDIT_ROUTE}
        component={RoutingListEdit}
      />
    </Switch>
  );
}
