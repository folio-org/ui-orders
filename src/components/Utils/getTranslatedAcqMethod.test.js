import { ACQUISITION_METHOD } from '@folio/stripes-acq-components';

import { getTranslatedAcqMethod } from './getTranslatedAcqMethod';

describe('getTranslatedAcqMethod', () => {
  it('should return either translated default value or initial value as a string', () => {
    expect(typeof getTranslatedAcqMethod(ACQUISITION_METHOD.purchase)).toBe('object');
    expect(typeof getTranslatedAcqMethod('Custom method')).toBe('string');
  });
});
