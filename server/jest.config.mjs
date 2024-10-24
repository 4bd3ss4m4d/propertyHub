export default {
  // The root directory that Jest should scan for tests and modules
  rootDir: './',

  // Specifies the test files to match
  testMatch: [
    '**/__tests__/**/*.test.js', // Match test files inside __tests__ folders
    '**/?(*.)+(spec|test).[jt]s?(x)', // Match .spec.js/.test.js/.jsx/.ts/.tsx files
  ],

  // Transform files using babel-jest to handle ES6 syntax
  transform: {
    '^.+\\.js$': 'babel-jest', // Use babel-jest to transform ES modules
  },

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Specify the test environment for Node.js applications
  testEnvironment: 'node',

  // Collect coverage from these files
  collectCoverage: true,
  collectCoverageFrom: [
    '**/utils/**/*.js',
    '**/controllers/**/*.js',
    '**/services/**/*.js',
    '**/models/**/*.js',
    '!**/node_modules/**',  // Exclude node_modules
    '!**/config/**',        // Exclude config files
  ],
  coverageDirectory: './coverage', // Directory for storing coverage reports

  // Ignore transforming node_modules, unless specific modules need to be transformed
  transformIgnorePatterns: [
    '/node_modules/'  // Ignore node_modules (default)
  ],
};
