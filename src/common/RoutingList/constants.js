import { FormattedMessage } from 'react-intl';
import { ROUTING_LIST_ROUTE } from '../constants';

export const VISIBLE_COLUMNS = ['name'];

export const COLUMN_MAPPING = {
  name: <FormattedMessage id="ui-users.permissions.assignedUsers.name" />,
};

export const UNIQUE_NAME_ERROR_CODE = 'routingListUniqueNameViolation';

export const ROUTING_LIST_CREATE_ROUTE = `${ROUTING_LIST_ROUTE}/create/:poLineId`;
export const ROUTING_LIST_VIEW_ROUTE = `${ROUTING_LIST_ROUTE}/view/:id`;
export const ROUTING_LIST_EDIT_ROUTE = `${ROUTING_LIST_ROUTE}/edit/:id`;
