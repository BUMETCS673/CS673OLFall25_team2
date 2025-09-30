/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.jest.json',
        isolatedModules: false,
        diagnostics: true,
        useESM: false,
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  moduleNameMapper: {
    // Mock static asset imports (images)
    '\\.(jpg|jpeg|png|gif|webp|svg)$':
      '<rootDir>/src/tests/__mocks__/fileMock.js',
    // Optionally mock styles if imported in components
    '\\.(css|less|scss|sass)$': '<rootDir>/src/tests/__mocks__/fileMock.js',
  },
};
