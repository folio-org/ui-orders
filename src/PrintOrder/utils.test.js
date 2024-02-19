import { order } from '../../test/jest/fixtures';
import { getOrderPrintData, getCurrencyRate, getPOLineTotalEstimatedPrice } from './utils';

const poLine = {
  currency: 'EUR',
  exchangeRate: 1,
  poLineEstimatedPrice: 1,
  quantityElectronic: 0,
  quantityPhysical: 1,
};

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

  it('should call `getCurrencyRate`', async () => {
    const ky = {
      get: jest.fn(() => ({
        json: () => Promise.resolve({
          exchangeRate: 1,
        }),
      })),
    };

    const resp = await getCurrencyRate(ky, order);

    expect(resp).toEqual(1);
  });

  describe('getPOLineTotalEstimatedPrice', () => {
    let ky;

    beforeEach(() => {
      jest.clearAllMocks();

      ky = {
        get: jest.fn(() => ({
          json: () => Promise.resolve({
            exchangeRate: 2,
          }),
        })),
      };
    });

    it('should call `getPOLineTotalEstimatedPrice`', async () => {
      const resp = await getPOLineTotalEstimatedPrice({ ky, poLine, systemCurrency: 'USD' });

      expect(resp).toEqual({
        totalItems: 1,
        totalEstimatedPrice: 1,
      });
    });

    it('should call `getPOLineTotalEstimatedPrice`', async () => {
      const resp = await getPOLineTotalEstimatedPrice({
        ky,
        poLine: {
          ...poLine,
          exchangeRate: null,
        },
        systemCurrency: 'USD',
      });

      expect(resp).toEqual({
        totalItems: 2,
        totalEstimatedPrice: 1,
      });
    });
  });
});
