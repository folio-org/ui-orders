import React from 'react';
import { FormattedMessage } from 'react-intl';

export const ITEM_STATUS = {
  inProcess: 'In process',
  onOrder: 'On order',
  received: 'Received',
  available: 'Available',
  inTransit: 'In transit',
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
