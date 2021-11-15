import { MODULE_ORDERS } from '@folio/stripes-acq-components';

import {
  CONFIG_ACQ_METHODS,
  getAcqMethodsConfig,
  validateAcqMethods,
  parseAcqMethodRow,
} from './utils';

const ACQ_METHOD = { id: 'id', name: 'name' };

describe('getAcqMethodsConfig', () => {
  it('should return an acquisition method config', () => {
    expect(getAcqMethodsConfig(ACQ_METHOD)).toEqual({
      id: ACQ_METHOD.id,
      module: MODULE_ORDERS,
      configName: CONFIG_ACQ_METHODS,
      code: `${CONFIG_ACQ_METHODS.toUpperCase()}_${ACQ_METHOD.name.toUpperCase()}`,
    });
  });
});

describe('validateAcqMethods', () => {
  it('should return \'items\' with validation errors', () => {
    expect(validateAcqMethods({ items: [ACQ_METHOD] }).items[0].name).toBeUndefined();
    expect(validateAcqMethods({ items: [{ name: '' }] }).items[0].name).toBeDefined();
  });
});

describe('parseAcqMethodRow', () => {
  it('should return row with parsed config value', () => {
    expect(parseAcqMethodRow({ value: '{"name":"name"}', id: 'id' })).toEqual(ACQ_METHOD);
  });
});
