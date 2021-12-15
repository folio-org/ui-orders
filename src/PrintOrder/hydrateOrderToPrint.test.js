import pick from 'lodash/pick';

import { hydrateOrderToPrint } from './hydrateOrderToPrint';
import { order, exportReport, hydratedOrder } from '../../test/jest/fixtures';

const mockLine = {
  ...pick(exportReport[0], ['billToRecord', 'shipToRecord', 'quantityPhysical', 'quantityElectronic', 'poLineEstimatedPrice']),
  vendorRecord: {
    addresses: [{ isPrimary: true }],
    phoneNumbers: [{ isPrimary: true }],
  },
};

describe('hydrateOrderToPrint', () => {
  it('should return hydrated order', () => {
    expect(hydrateOrderToPrint({ order: { order, lines: [mockLine, mockLine] } })).toEqual({
      ...hydratedOrder,
      lines: hydratedOrder.lines.concat(hydratedOrder.lines),
    });
  });

  it('should return hydrated order for specific line', () => {
    expect(hydrateOrderToPrint({ order: { order, lines: [mockLine] } })).toEqual({
      ...hydratedOrder,
      totalItems: mockLine.quantityPhysical + mockLine.quantityElectronic,
      totalEstimatedPrice: mockLine.poLineEstimatedPrice,
    });
  });

  it('should return undefined if order is absent', () => {
    expect(hydrateOrderToPrint({})).toBeFalsy();
  });
});
