import { order } from '../../test/jest/fixtures';
import {
  getOrderPrintData,
} from './utils';

describe('utils', () => {
  it('should call `getOrderPrintData`', () => {
    const ky = {
      get: jest.fn(() => ({
        json: () => Promise.resolve(),
      })),
    };

    getOrderPrintData(ky, order);

    expect(ky.get).toHaveBeenCalled();
  });
});
