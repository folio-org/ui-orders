import { act, renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { orderLine } from 'fixtures/orderLine';
import { UPDATE_HOLDINGS_OPERATIONS_MAP } from '../../constants';
import { useChangeInstanceConnection } from './useChangeInstanceConnection';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const selectedInstance = {
  id: 'selectedInstanceId',
  title: 'Instance title',
};

const instanceChangeParams = {
  deleteAbandonedHoldings: false,
  holdingsOperation: UPDATE_HOLDINGS_OPERATIONS_MAP.create,
};

describe('useChangeInstanceConnection', () => {
  const kyMock = {
    patch: jest.fn(() => ({
      json: jest.fn(() => Promise.resolve()),
    })),
  };

  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue(kyMock);
  });

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

  it('should call \'patch\' method on submit', async () => {
    const { result } = renderHook(() => (
      useChangeInstanceConnection(orderLine)
    ));

    await act(async () => result.current.onSelectInstance(selectedInstance));
    await act(async () => result.current.submitChangeInstance(instanceChangeParams));

    expect(kyMock.patch).toHaveBeenCalled();
  });
});
