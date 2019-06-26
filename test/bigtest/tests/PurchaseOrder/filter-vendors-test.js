import React from 'react';

import {
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';
import { filterValues } from '../../../../src/common/FieldSelection';

const organizationOptions = [{
  label: 'Alexander Street Press (ALEXS)',
  id: 1,
}, {
  label: 'Amazon.com (AMAZ)',
  id: 2,
}, {
  label: 'American Chemical Society (ACSO)',
  id: 3,
}, {
  label: 'Bibsam (consortia1)',
  id: 4,
}];

describe('Field selection', () => {
  it('filterValues should return 2 filtered items', () => {
    expect(filterValues('Am', organizationOptions).length).to.equal(2);
  });

  it('filterValues should return all items', () => {
    expect(filterValues('', organizationOptions).length).to.equal(4);
  });
});
