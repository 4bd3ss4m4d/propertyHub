export default {
  rootDir: './',
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  transform: {}, // Empty transform object for native ESM
  clearMocks: true,
  resetMocks: false,
  restoreMocks: false,
  testEnvironment: 'node',
  
  // Remove extensionsToTreatAsEsm since we're using "type": "module"
  
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^__tests__/(.*)$": "<rootDir>/__tests__/$1"
  },
  
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 20000,

  collectCoverage: true,
  collectCoverageFrom: [
    '**/utils/**/*.js',
    '**/controllers/**/*.js',
    '**/services/**/*.js',
    '**/models/**/*.js',
    '!**/node_modules/**',
    '!**/config/**',
  ],
  coverageDirectory: './coverage',

  transformIgnorePatterns: [
    '/node_modules/',
  ],
};