/*
 AI-generated code: 100% Tool: GPT

 Human code: 0%

 Framework-generated code: 0%
*/

/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "jsdom", // needed for React components

  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"], // your global setup

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
// ... (previous config)
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  moduleNameMapper: {
    // Mock static asset imports (images)
    '\\.(jpg|jpeg|png|gif|webp|svg)$':
      '<rootDir>/src/tests/__mocks__/fileMock.js',
    // Mock CSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
