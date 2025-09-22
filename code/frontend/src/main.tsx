import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css"; // <-- added: ensure theme vars override Bootstrap
import { ThemeProvider } from "./theme/ThemeContext";

// Wrap the app in ThemeProvider to enable theme context
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);