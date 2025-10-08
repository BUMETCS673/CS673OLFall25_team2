// main.tsx
// Copilot assisted with this file
// 70% AI-generated, 30% human refined

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/global.css';
import { ThemeProvider } from './theme/ThemeContext';

// Wrap the app in ThemeProvider to enable theme context
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
