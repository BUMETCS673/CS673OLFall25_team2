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
// Polyfill for window.matchMedia used by CSS/media-query based code (e.g. theme detection).
// Some components call window.matchMedia(...) which is not implemented in the jsdom used by Jest.
if (typeof window !== 'undefined' && typeof (window as any).matchMedia === 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {}, // deprecated
      removeListener: () => {}, // deprecated
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// Provide a no-op for window.scrollTo (some libs call it during rendering)
if (typeof window !== 'undefined' && typeof (window as any).scrollTo === 'undefined') {
  // @ts-ignore
  window.scrollTo = () => {};
}

// Optional: stub ResizeObserver if components use it (safe no-op implementation)
if (typeof (window as any).ResizeObserver === 'undefined') {
  // @ts-ignore
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-ignore
  window.ResizeObserver = ResizeObserver;
}