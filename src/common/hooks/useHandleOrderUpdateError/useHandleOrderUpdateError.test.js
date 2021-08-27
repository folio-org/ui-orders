import { renderHook } from '@testing-library/react-hooks';

import useHandleOrderUpdateError from './useHandleOrderUpdateError';
import showUpdateOrderError from '../../../components/Utils/order/showUpdateOrderError';

jest.mock('../../../components/Utils/order/showUpdateOrderError', () => jest.fn());

const mutator = {
  GET: jest.fn().mockResolvedValue({ name: 'name' }),
};

const getMockResponse = (code = 'inactiveExpenseClass', key = 'expenseClassId') => ({
  clone: () => ({
    json: () => ({
      errors: [{
        code,
        parameters: [{
          key,
          value: 'value',
        }],
      }],
    }),
  }),
});

describe('useHandleOrderUpdateError', () => {
  beforeEach(() => {
    mutator.GET.mockClear();
    showUpdateOrderError.mockClear();
  });

  it('should return order update error handler', () => {
    const { result } = renderHook(() => useHandleOrderUpdateError(mutator));

    expect(result.current[0]).toBeInstanceOf(Function);
  });

  it('should handle error response with \'inactiveExpenseClass\' error code', async () => {
    const { result } = renderHook(() => useHandleOrderUpdateError(mutator));

    try {
      await result.current[0](getMockResponse());
    } catch {
      expect(showUpdateOrderError).not.toHaveBeenCalled();
    }

    expect(mutator.GET).toHaveBeenCalled();
  });

  it('should handle response with another error code', async () => {
    const { result } = renderHook(() => useHandleOrderUpdateError(mutator));

    try {
      await result.current[0](getMockResponse(''));
    } catch {
      expect(mutator.GET).not.toHaveBeenCalled();
    }

    expect(showUpdateOrderError).toHaveBeenCalled();
  });
});
