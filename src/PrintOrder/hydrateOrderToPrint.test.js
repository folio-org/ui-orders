import pick from 'lodash/pick';

import { order, exportReport, hydratedOrder } from '../../test/jest/fixtures';

import { hydrateOrderToPrint } from './hydrateOrderToPrint';
import { getPOLineTotalEstimatedPrice } from './utils';

jest.mock('./utils', () => ({
  getPOLineTotalEstimatedPrice: jest.fn(),
}));

const mockLine = {
  ...pick(exportReport[0], ['billToRecord', 'shipToRecord', 'quantityPhysical', 'quantityElectronic', 'poLineEstimatedPrice']),
  vendorRecord: {
    addresses: [{ isPrimary: true }],
    phoneNumbers: [{ isPrimary: true }],
  },
};

describe('hydrateOrderToPrint', () => {
  beforeEach(async () => {
    getPOLineTotalEstimatedPrice.mockReturnValue({
      totalItems: mockLine.quantityPhysical + mockLine.quantityElectronic,
      totalEstimatedPrice: mockLine.poLineEstimatedPrice,
    });
  });

  it('should return hydrated order', async () => {
    const result = await hydrateOrderToPrint({ order: { order, lines: [mockLine, mockLine] } });

    expect(result).toEqual({
      ...hydratedOrder,
      lines: hydratedOrder.lines.concat(hydratedOrder.lines),
    });
  });

  it('should return hydrated order for specific line', async () => {
    const result = await hydrateOrderToPrint({ order: { order, lines: [mockLine] } });

    expect(result).toEqual({
      ...hydratedOrder,
      totalItems: mockLine.quantityPhysical + mockLine.quantityElectronic,
      totalEstimatedPrice: mockLine.poLineEstimatedPrice,
    });
  });

  it('should return undefined if order is absent', async () => {
    const result = await hydrateOrderToPrint({});

    expect(result).toBeFalsy();
  });
});
