import {
  ORDER_LINES_ROUTE,
  ROUTING_LIST_ROUTE,
} from '../../../common/constants';

export const FALLBACK_ROUTE = ORDER_LINES_ROUTE;
export const ROUTING_LIST_CREATE_ROUTE = `${ROUTING_LIST_ROUTE}/create/:poLineId`;
export const ROUTING_LIST_VIEW_ROUTE = `${ROUTING_LIST_ROUTE}/view/:id`;
export const ROUTING_LIST_EDIT_ROUTE = `${ROUTING_LIST_ROUTE}/edit/:id`;
