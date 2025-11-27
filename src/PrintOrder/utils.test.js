import { order } from 'fixtures';
import { getOrderPrintData } from './utils';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  fetchTenantAddressesByIds: jest.fn(() => () => Promise.resolve({ addresses: [] })),
}));

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
