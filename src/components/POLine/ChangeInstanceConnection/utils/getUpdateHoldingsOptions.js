import {
  UPDATE_HOLDINGS_OPERATIONS,
  UPDATE_HOLDINGS_OPERATIONS_MAP,
} from '../constants';

export const getUpdateHoldingsOptions = (isMovingRestricted) => {
  return (
    Object.keys(UPDATE_HOLDINGS_OPERATIONS_MAP).map((key) => ({
      labelId: `ui-orders.line.changeInstance.holdingOperations.${key}`,
      value: UPDATE_HOLDINGS_OPERATIONS_MAP[key],
      disabled: Boolean(isMovingRestricted && (key === UPDATE_HOLDINGS_OPERATIONS.move)),
    }))
  );
};
