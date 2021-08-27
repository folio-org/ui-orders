import { renderHook } from '@testing-library/react-hooks';

import useCloseReasonOptions from './useCloseReasonOptions';

describe('useCloseReasonOptions', () => {
  it('should return close reason options from default list', () => {
    const { result } = renderHook(() => (
      useCloseReasonOptions(({ id }) => id, [{ reason: 'Canceled' }])
    ));

    expect(result.current).toEqual([{
      label: 'ui-orders.closeOrderModal.closingReasons.canceled',
      value: 'Canceled',
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
