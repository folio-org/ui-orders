import React from 'react';
import { FormattedMessage } from 'react-intl';

export const ITEM_STATUS = {
  inProcess: 'In process',
  onOrder: 'On order',
  available: 'Available',
  inTransit: 'In transit',
  orderClosed: 'Order closed',
  undefined: 'Undefined',
};

export const getItemStatusLabel = (itemStatus) => {
  return itemStatus
    ? (
      <FormattedMessage
        id={`ui-orders.receiving.itemStatus.${itemStatus}`}
        defaultMessage={itemStatus}
      />
    )
    : '';
};
