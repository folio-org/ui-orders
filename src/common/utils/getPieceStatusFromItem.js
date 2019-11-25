import { get } from 'lodash';

import { ITEM_STATUS } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const getPieceStatusFromItem = (itemsMap, itemId) => {
  const itemStatus = get(itemsMap, `${itemId}.status.name`);

  return itemStatus === ITEM_STATUS.onOrder
    ? ITEM_STATUS.inProcess
    : itemStatus || '';
};
