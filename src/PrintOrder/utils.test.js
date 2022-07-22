import { order } from '../../test/jest/fixtures';
import { getOrderPrintData } from './utils';

describe('getOrderPrintData', () => {
  it('should call ky', () => {
    const ky = {
      get: jest.fn(() => ({
        json: () => Promise.resolve(),
      })),
    };

    getOrderPrintData(ky, order);

    expect(ky.get).toHaveBeenCalled();
  });
});
