import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { someNewValidation } from '../../../src/components/Utils/Validate';

describe('(Validate) someNewValidation', () => {
  const wrongValueToValidate = 'some value';
  let validationresult;

  beforeEach(() => {
    validationresult = someNewValidation(wrongValueToValidate);
  });

  it('should fail validation with wrong value', () => {
    expect(validationresult).to.equal('something wrong (validation message)');
  });
});
