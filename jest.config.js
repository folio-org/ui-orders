const esModules = ['@folio'].join('|');

module.exports = {
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/test/**',
  ],
  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/test/jest/jest-transformer.js',
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  moduleNameMapper: {
    '^.+\\.(css)$': '<rootDir>/node_modules/jest-css-modules',
    '^.+\\.(svg)$': 'identity-obj-proxy',
  },
  testMatch: ['<rootDir>/src/**/?(*.)test.{js,jsx}'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: ['<rootDir>/test/jest/setupTests.js'],
};
