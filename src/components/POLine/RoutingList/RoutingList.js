import {
  Route,
  Switch,
} from 'react-router-dom';

import {
  ROUTING_LIST_CREATE_ROUTE,
  ROUTING_LIST_EDIT_ROUTE,
  ROUTING_LIST_VIEW_ROUTE,
} from './constants';
import { RoutingListCreate } from './RoutingListCreate';
import { RoutingListEdit } from './RoutingListEdit';
import { RoutingListView } from './RoutingListView';

export function RoutingList() {
  return (
    <Switch>
      <Route
        path={ROUTING_LIST_CREATE_ROUTE}
        component={RoutingListCreate}
      />
      <Route
        path={ROUTING_LIST_VIEW_ROUTE}
        component={RoutingListView}
      />
      <Route
        path={ROUTING_LIST_EDIT_ROUTE}
        component={RoutingListEdit}
      />
    </Switch>
  );
}
