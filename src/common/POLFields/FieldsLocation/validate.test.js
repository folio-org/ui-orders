import {
  validateQuantityPhysical,
  validateQuantityElectronic,
  parseQuantity,
  isLocationsRequired,
  validateLocation,
} from './validate';

const getLocations = (v, p, e) => ({
  locations: [{
    locationId: v,
    quantityPhysical: p,
    quantityElectronic: e,
  }],
});

const createInventory = 'Instance, Holding, Item';

describe('validateQuantityPhysical', () => {
  it('should return validation message', () => {
    expect(validateQuantityElectronic(1, {
      orderFormat: 'Physical Resource',
      eresource: {
        createInventory,
      },
      cost: {
        quantityElectronic: 3,
      },
    })).toBeTruthy();
  });
});

describe('validateQuantityPhysical', () => {
  it('should return validation message', () => {
    expect(validateQuantityPhysical(1, {
      orderFormat: 'Physical Resource',
      physical: {
        createInventory,
      },
      cost: {
        quantityPhysical: 3,
      },
    })).toBeTruthy();
  });
});

describe('parseQuantity', () => {
  it('should return parsed number', () => {
    expect(parseQuantity('42')).toBe(42);
  });

  it('should return 0 if quantity value is missing', () => {
    expect(parseQuantity()).toBe(0);
  });
});

describe('isLocationsRequired', () => {
  it('should return validation message', () => {
    expect(isLocationsRequired([], {
      orderFormat: 'Physical Resource',
      physical: {
        createInventory,
      },
    })).toBeTruthy();
  });
});

describe('validateLocation', () => {
  it('should return validation message if value is missing', () => {
    expect(validateLocation(null, { locations: [] })).toBeTruthy();
  });

  it('should return validation message if it is not valid', () => {
    expect(validateLocation('value', getLocations('value', 0, 0))).toBeTruthy();
  });

  it('should return undefined if it is valid', () => {
    expect(validateLocation('value', getLocations('value', 1, 1))).toBeFalsy();
  });
});
