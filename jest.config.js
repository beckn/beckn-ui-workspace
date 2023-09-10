/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx'
        }
      }
    ]
    // '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testEnvironment: 'jsdom', // Test Environment for web apps. Can use specific Environment for specific files By adding a @jest-environment docblock at the top of the file
  roots: ['<rootDir>'],
  transformIgnorePatterns: [' "node_modules/(?!variables/.*)"'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'] // initial setup files. Can be use to do global mocks or similar stuff
}
