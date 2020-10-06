const { defaults } = require('@folio/stripes-acq-components/jest.config');

module.exports = {
  ...defaults,
  coverageDirectory: './artifacts/coverage-jest/',
};
