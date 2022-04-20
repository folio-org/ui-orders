import { renderHook } from '@testing-library/react-hooks';

import useCloseReasonOptions from './useCloseReasonOptions';

describe('useCloseReasonOptions', () => {
  it('should return close reason options from default list', () => {
    const { result } = renderHook(() => (
      useCloseReasonOptions(({ id }) => id, [{ reason: 'Cancelled' }])
    ));

    expect(result.current).toEqual([{
      label: 'ui-orders.closeOrderModal.closingReasons.cancelled',
      value: 'Cancelled',
    }]);
  });

  it('should return close reason options', () => {
    const { result } = renderHook(() => (
      useCloseReasonOptions(({ id }) => id, [{ reason: 'Some reason' }])
    ));

    expect(result.current).toEqual([{
      label: 'Some reason',
      value: 'Some reason',
    }]);
  });
});
