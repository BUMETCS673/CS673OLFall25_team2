import React from "react";
import { useTheme } from "../../theme/ThemeContext";

/**
 * Theme toggle button for switching between light and dark mode.
 * Updates global font/background colors and persists preference.
 */
export default function ThemeToggler() {
  const { theme, toggle } = useTheme();

  return (
    <button
      className="btn btn-outline-secondary w-100"
      onClick={toggle}
      aria-label="Toggle color theme"
    >
      {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </button>
  );
}