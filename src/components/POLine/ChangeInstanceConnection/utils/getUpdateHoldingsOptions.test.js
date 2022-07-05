import { UPDATE_HOLDINGS_OPERATIONS_MAP } from '../constants';
import { getUpdateHoldingsOptions } from './getUpdateHoldingsOptions';

describe('getUpdateHoldingsOptions', () => {
  it('should return options for \'How to update Holdings\' field', () => {
    const isMovingRestricted = false;

    expect(getUpdateHoldingsOptions(isMovingRestricted)).toEqual(
      Object.keys(UPDATE_HOLDINGS_OPERATIONS_MAP).map((key) => ({
        labelId: `ui-orders.line.changeInstance.holdingOperations.${key}`,
        value: UPDATE_HOLDINGS_OPERATIONS_MAP[key],
        disabled: false,
      })),
    );
  });
});
