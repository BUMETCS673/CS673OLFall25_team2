/*
 AI-generated code: 100% Tool: GPT

 Human code: 0%

 Framework-generated code: 0%
*/

import 'whatwg-fetch';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';


global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,          // You can toggle to true if needed
    media: query,
    onchange: null,
    addListener: jest.fn(),  // deprecated, but some libs still use it
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});
