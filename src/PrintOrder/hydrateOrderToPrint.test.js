import pick from 'lodash/pick';

import { order, exportReport, hydratedOrder } from '../../test/jest/fixtures';

import { hydrateOrderToPrint } from './hydrateOrderToPrint';

const mockLine = {
  ...pick(exportReport[0], ['billToRecord', 'shipToRecord', 'quantityPhysical', 'quantityElectronic', 'poLineEstimatedPrice']),
  vendorRecord: {
    addresses: [{ isPrimary: true }],
    phoneNumbers: [{ isPrimary: true }],
  },
};

const getPOLineTotalEstimatedPriceMock = jest.fn().mockReturnValue({
  totalEstimatedPrice: mockLine.poLineEstimatedPrice,
});

describe('hydrateOrderToPrint', () => {
  it('should return hydrated order', async () => {
    const result = await hydrateOrderToPrint({
      order: { order, lines: [mockLine, mockLine] },
      getPOLineTotalEstimatedPrice: getPOLineTotalEstimatedPriceMock,
    });

    expect(result).toEqual({
      ...hydratedOrder,
      lines: hydratedOrder.lines.concat(hydratedOrder.lines),
    });
  });

  it('should return hydrated order for specific line', async () => {
    const result = await hydrateOrderToPrint({
      order: { order, lines: [mockLine] },
      getPOLineTotalEstimatedPrice: getPOLineTotalEstimatedPriceMock,
    });

    expect(result).toEqual({
      ...hydratedOrder,
      totalEstimatedPrice: mockLine.poLineEstimatedPrice,
    });
  });

  it('should return undefined if order is absent', async () => {
    const result = await hydrateOrderToPrint({});

    expect(result).toBeFalsy();
  });
});
