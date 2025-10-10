// ThemeContext.tsx
// Copilot assisted with this component
// 70% AI-generated, 30% human refined

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';
type ThemeContextType = { theme: Theme; toggle: () => void };

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const STORAGE_KEY = 'appTheme';

/**
 * Reads the saved theme from localStorage (if available),
 * otherwise defaults to light theme.
 */
function getInitialTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved === 'light' || saved === 'dark') return saved;
  return 'light'; // Always default to light theme for new users
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Ensure theme is set on initial load
  useEffect(() => {
    // For first-time users, ensure light theme is set as default
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, 'light');
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    // Save theme across reloads and add it to <html> for CSS overrides
    localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Memoized context value so components can call toggle()
  const value = useMemo(
    () => ({
      theme,
      toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/**
 * Custom hook for accessing theme context.
 * Throws if used outside of ThemeProvider.
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
