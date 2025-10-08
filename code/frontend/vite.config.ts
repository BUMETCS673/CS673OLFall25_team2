import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Dev-only proxy: when VITE_API_BASE_URL is not set, this allows calling /api/* locally
    // In production builds we expect VITE_API_BASE_URL (or fallback in http.ts) to point to deployed backend
    proxy: { '/api': { target: 'http://localhost:8080', changeOrigin: true } },
  },
});
