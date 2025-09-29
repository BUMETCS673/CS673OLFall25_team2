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
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }], // TypeScript
    "^.+\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/fileTransformer.cjs" // image imports
  },

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy" // CSS imports
  }
};
