import { act, renderHook } from '@testing-library/react-hooks';

import { orderLine } from '../../../../../../test/jest/fixtures/orderLine';
import { UPDATE_HOLDINGS_OPERATIONS_MAP } from '../../constants';
import { useChangeInstanceConnection } from './useChangeInstanceConnection';

const selectedInstance = {
  id: 'selectedInstanceId',
  title: 'Instance title',
};

const instanceChangeParams = {
  deleteAbandonedHoldings: false,
  holdingsOperation: UPDATE_HOLDINGS_OPERATIONS_MAP.create,
};

describe('useChangeInstanceConnection', () => {
  it('should return tools for managing change instance connection operation', () => {
    const { result } = renderHook(() => (
      useChangeInstanceConnection(orderLine)
    ));

    expect(Object.keys(result.current).sort()).toEqual([
      'cancelChangeInstance',
      'onSelectInstance',
      'selectedInstance',
      'showConfirmChangeInstance',
      'submitChangeInstance',
    ].sort());
  });

  it('should open \'Change instance\' modal and set new instance data when new instance was selected', () => {
    const { result } = renderHook(() => (
      useChangeInstanceConnection(orderLine)
    ));

    expect(result.current.showConfirmChangeInstance).toBeFalsy();

    act(() => result.current.onSelectInstance(selectedInstance));

    expect(result.current.showConfirmChangeInstance).toBeTruthy();
    expect(result.current.selectedInstance).toEqual(selectedInstance);
  });

  it('should close \'Change instance\' modal when operation was cancelled', () => {
    const { result } = renderHook(() => (
      useChangeInstanceConnection(orderLine)
    ));

    act(() => result.current.onSelectInstance(selectedInstance));
    
    expect(result.current.showConfirmChangeInstance).toBeTruthy();
    
    act(() => result.current.cancelChangeInstance());

    expect(result.current.showConfirmChangeInstance).toBeFalsy();
  });

  it('should submit instance changing and close \'Change instance\' modal when operation was submitted', () => {
    const { result } = renderHook(() => (
      useChangeInstanceConnection(orderLine)
    ));

    act(() => result.current.onSelectInstance(selectedInstance));
    act(() => result.current.submitChangeInstance(instanceChangeParams));

    expect(result.current.showConfirmChangeInstance).toBeFalsy();
  });
});
