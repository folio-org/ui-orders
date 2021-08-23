import pick from 'lodash/pick';

import { hydrateOrderToPrint } from './hydrateOrderToPrint';
import { order, exportReport, hydratedOrder } from '../../test/jest/fixtures';

const mockOrder = {
  order,
  lines: [{
    ...pick(exportReport[0], ['billToRecord', 'shipToRecord']),
    vendorRecord: {
      addresses: [{ isPrimary: true }],
      phoneNumbers: [{ isPrimary: true }],
    },
  }],
};

describe('hydrateOrderToPrint', () => {
  it('should return hydrated order', () => {
    expect(hydrateOrderToPrint({ order: mockOrder })).toEqual(hydratedOrder);
  });

  it('should return undefined if order is absent', () => {
    expect(hydrateOrderToPrint({})).toBeFalsy();
  });
});
