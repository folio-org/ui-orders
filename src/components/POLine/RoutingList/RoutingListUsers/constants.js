import { FormattedMessage } from 'react-intl';

export const COLUMN_NAME = {
  orderNumber: 'orderNumber',
  user: 'user',
};

export const VISIBLE_COLUMNS = [COLUMN_NAME.orderNumber, COLUMN_NAME.user];

export const ROUTING_LIST_USERS_COLUMN_MAPPING = {
  [COLUMN_NAME.orderNumber]: <FormattedMessage id="ui-orders.routing.list.orderNumber" />,
  [COLUMN_NAME.user]: <FormattedMessage id="ui-orders.routing.list.column.user" />,
};

export const columnWidths = {
  [COLUMN_NAME.orderNumber]: { min: 50, max: 80 },
  [COLUMN_NAME.user]: '60%',
  [COLUMN_NAME.remove]: '10%',
};
