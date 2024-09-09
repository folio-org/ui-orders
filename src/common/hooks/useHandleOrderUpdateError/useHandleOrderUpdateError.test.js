import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useShowCallout } from '@folio/stripes-acq-components';

import showUpdateOrderError from '../../../components/Utils/order/showUpdateOrderError';
import useHandleOrderUpdateError from './useHandleOrderUpdateError';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
}));
jest.mock('../../../components/Utils/order/showUpdateOrderError', () => jest.fn());

const mutator = {
  GET: jest.fn().mockResolvedValue({ name: 'name' }),
};

const getMockResponse = (code = 'inactiveExpenseClass', key = 'expenseClassId', message = '') => ({
  clone: () => ({
    json: () => ({
      errors: [{
        code,
        parameters: [{
          key,
          value: 'value',
        }],
        message,
      }],
    }),
  }),
});

describe('useHandleOrderUpdateError', () => {
  const sendCallout = jest.fn();

  beforeEach(() => {
    mutator.GET.mockClear();
    showUpdateOrderError.mockClear();
    useShowCallout.mockReturnValue(sendCallout);
  });

  it('should return order update error handler', () => {
    const { result } = renderHook(() => useHandleOrderUpdateError(mutator));

    expect(result.current[0]).toBeInstanceOf(Function);
  });

  it('should handle error response with \'inactiveExpenseClass\' error code', async () => {
    const { result } = renderHook(() => useHandleOrderUpdateError(mutator));

    try {
      await result.current[0](getMockResponse);

      expect(mutator.GET).toHaveBeenCalled();
    } catch (e) {
      expect(e.message).toEqual('Order update error');
    }
  });

  it('should handle response with another error code', async () => {
    const { result } = renderHook(() => useHandleOrderUpdateError(mutator));

    try {
      await result.current[0](() => getMockResponse(''));

      expect(showUpdateOrderError).toHaveBeenCalled();
    } catch (e) {
      expect(e.message).toEqual('Order update error');
    }
  });

  it('should handle `Invalid token` error message', async () => {
    const { result } = renderHook(() => useHandleOrderUpdateError(mutator));

    try {
      await result.current[0](getMockResponse('genericError', 'test', 'Invalid token'));
      expect(showUpdateOrderError).toHaveBeenCalled();
    } catch (e) {
      expect(e.message).toEqual('Order update error');
      expect(sendCallout).toHaveBeenCalledWith({
        'messageId': 'ui-orders.errors.missingAffiliation',
        'type': 'error',
      });
    }
  });
});
