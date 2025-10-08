// src/setupTests.ts
// 100% Copilot generated setup for testing environment

import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder for libraries that expect them in the test env
// Node 18+ provides these in 'util', but jsdom environment may not attach to global
import { TextEncoder, TextDecoder } from 'util';
// @ts-ignore - augment global for test environment
if (typeof (global as any).TextEncoder === 'undefined') {
  // @ts-ignore
  (global as any).TextEncoder = TextEncoder;
}
// @ts-ignore - augment global for test environment
if (typeof (global as any).TextDecoder === 'undefined') {
  // @ts-ignore
  (global as any).TextDecoder = TextDecoder as unknown as new () => TextDecoder;
}

// Provide a minimal window.matchMedia implementation for components relying on it
if (!(window as any).matchMedia) {
  (window as any).matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated API
    removeListener: () => {}, // deprecated API
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
