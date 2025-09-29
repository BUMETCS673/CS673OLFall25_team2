# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

# Test Suite for Auth (Login/Registration), MyJobs (Saved/Applied), and 401/404 (Jest framework)

This section explains how to install, configure, and run the Jest test suite for this project, including coverage and watch mode. Instructions cover both JavaScript and TypeScript setups.

1. Install Dev Dependencies
   JavaScript
   npm install --save-dev jest @testing-library/react \
   @testing-library/jest-dom @testing-library/user-event \
   jest-environment-jsdom identity-obj-proxy

TypeScript
npm install --save-dev jest ts-jest @types/jest \
@testing-library/react @testing-library/jest-dom @testing-library/user-event \
jest-environment-jsdom identity-obj-proxy

npx ts-jest config:init // Initialize ts-jest configuration

2. Package Scripts (package.json)

Add the following scripts to run tests easily:

{
"scripts": {
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage"
}
}

3. Jest Setup File

Create a setup file src/setupTests.ts (TypeScript) or src/setupTests.js (JavaScript):

import '@testing-library/jest-dom';
"This ensures custom matchers like toBeInTheDocument() work in your tests."

4. Run Tests
   // Run all tests once
   npm test

// Run in watch mode (re-runs tests on file changes)
npm run test:watch

// Run tests with coverage report
npm run test:coverage

5. What’s Covered

Login & Registration
Field validation, happy path, error scenarios

MyJobs
Saved/Applied jobs fetch/render
Mutations: add, delete single, delete bulk

Routing
401 → redirect to /unauthorized
404 → catch-all page

HTTP Requests
No GET bodies
DELETE payloads include userId and jobId/jobIds

Accessibility
Labeled inputs
Alerts with role="alert"

6. Interpreting Results

Failing tests: Jest shows which test(s) failed, why, and the related file/line.

Coverage report: Run npm run test:coverage to see a report. Our project requires ≥80% coverage; coverage below this threshold indicates more tests are needed.

7. Locating Tests

All test files are located in src/tests/.
Files are named according to the feature they test, e.g., Login.test.ts tests login functionality.

8. Mocked Endpoints

Routes and endpoints are mocked to simulate:
Login/Registration success and failure
MyJobs fetch and mutation operations
Routing scenarios like 401/404 errors
