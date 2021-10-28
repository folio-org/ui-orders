import { ORDER_FORMATS } from '@folio/stripes-acq-components';

import { getFieldQuantity } from './getFieldQuantity';

const {
  electronicResource,
  physicalResource,
  PEMix,
} = ORDER_FORMATS;

describe('getFieldQuantity', () => {
  it('should return initial quantity value if it exists', () => {
    const initialValues = {
      orderFormat: physicalResource,
      cost: {
        quantityPhysical: 2,
      },
    };

    expect(getFieldQuantity(initialValues, 'cost.quantityPhysical')).toBe(2);
  });

  it('should return \'0\' if the quantity is not specified, but included in the POL format', () => {
    const initialValues = {
      orderFormat: PEMix,
      cost: {},
    };

    expect(getFieldQuantity(initialValues, 'cost.quantityElectronic')).toBe(0);
  });

  it('should return \'null\' if the quantity is not specified and not included in the POL format', () => {
    const initialValues = {
      orderFormat: electronicResource,
      cost: {},
    };

    expect(getFieldQuantity(initialValues, 'cost.quantityPhysical')).toBe(null);
  });
});
