import '@folio/stripes-acq-components/test/jest/__mock__';

import { DISCOUNT_TYPE } from './const';

import calculateEstimatedPrice from './calculateEstimatedPrice';

const INITIAL_PO_LINE = { cost: { currency: 'USD' } };

describe('calculateEstimatedPrice', () => {
  it('should return 0.00 when po line does not have cost or currency', () => {
    expect(calculateEstimatedPrice(undefined)).toBe(0.00);
    expect(calculateEstimatedPrice({})).toBe(0.00);
    expect(calculateEstimatedPrice({
      cost: {
        quantityPhysical: 5,
        listUnitPrice: 5,
      },
    })).toBe(0);
  });

  it('should return correct price when physical cost is passed', () => {
    const poLine = {
      cost: {
        ...INITIAL_PO_LINE.cost,
        quantityPhysical: 5,
        listUnitPrice: 5,
      },
    };

    expect(calculateEstimatedPrice(poLine)).toBe(25.00);
  });

  it('should return correct price when electronic cost is passed', () => {
    const poLine = {
      cost: {
        ...INITIAL_PO_LINE.cost,
        quantityElectronic: 5,
        listUnitPriceElectronic: 5,
      },
    };

    expect(calculateEstimatedPrice(poLine)).toBe(25.00);
  });

  it('should return correct price when physical and electronic costs are passed', () => {
    const poLine = {
      cost: {
        ...INITIAL_PO_LINE.cost,
        quantityPhysical: 5,
        listUnitPrice: 5,
        quantityElectronic: 5,
        listUnitPriceElectronic: 5,
      },
    };

    expect(calculateEstimatedPrice(poLine)).toBe(50.00);
  });

  it('should return correct price with included additional cost', () => {
    const poLine = {
      cost: {
        ...INITIAL_PO_LINE.cost,
        quantityElectronic: 5,
        listUnitPriceElectronic: 5,
        additionalCost: 5,
      },
    };

    expect(calculateEstimatedPrice(poLine)).toBe(30.00);
  });

  it('should return correct price when discount (default - amount) is passed', () => {
    const poLine = {
      cost: {
        ...INITIAL_PO_LINE.cost,
        quantityPhysical: 5,
        listUnitPrice: 5,
        discount: 5,
      },
    };

    expect(calculateEstimatedPrice(poLine)).toBe(20.00);
  });

  it('should return correct price when discount (amount) is passed', () => {
    const poLine = {
      cost: {
        ...INITIAL_PO_LINE.cost,
        quantityPhysical: 5,
        listUnitPrice: 5,
        discount: 5,
        discountType: DISCOUNT_TYPE.amount,
      },
    };

    expect(calculateEstimatedPrice(poLine)).toBe(20.00);
  });

  it('should return correct price when discount (percent) is passed', () => {
    const poLine = {
      cost: {
        ...INITIAL_PO_LINE.cost,
        quantityPhysical: 5,
        listUnitPrice: 5,
        additionalCost: 1,
        discount: 29,
        discountType: DISCOUNT_TYPE.percentage,
      },
    };

    expect(calculateEstimatedPrice(poLine)).toBe(18.75);
  });

  it('should return correct price with cost currency', () => {
    const poLine = {
      cost: {
        ...INITIAL_PO_LINE.cost,
        quantityElectronic: 5.36,
        listUnitPriceElectronic: 5,
        additionalCost: 5,
        discount: 9,
        discountType: DISCOUNT_TYPE.percentage,
        currency: 'BHD',
      },
    };

    expect(calculateEstimatedPrice(poLine)).toBe(29.388);
  });

  it('should return correct price with system currency (cost currency is not defined)', () => {
    const poLine = {
      cost: {
        ...INITIAL_PO_LINE.cost,
        quantityElectronic: 5.36,
        listUnitPriceElectronic: 5,
        additionalCost: 5,
        discount: 9,
        discountType: DISCOUNT_TYPE.percentage,
      },
    };

    expect(calculateEstimatedPrice(poLine)).toBe(29.39);
  });
});
