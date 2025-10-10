// src/tests/themeToggler.tdd.test.tsx
// 80% AI-generated, 20% human refined

import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggler from '../components/asideAndToggler/themeToggler';
import { ThemeProvider } from '../theme/ThemeContext';

describe('ThemeToggler', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders moon icon when initial theme is light', () => {
    localStorage.setItem('appTheme', 'light');
    render(
      <ThemeProvider>
        <ThemeToggler />
      </ThemeProvider>
    );
    const img = screen.getByAltText(/switch to dark mode/i);
    expect(img).toBeInTheDocument();
  });

  it('renders sun icon when initial theme is dark', () => {
    localStorage.setItem('appTheme', 'dark'); // 模拟初始 dark
    render(
      <ThemeProvider>
        <ThemeToggler />
      </ThemeProvider>
    );
    const img = screen.getByAltText(/switch to light mode/i);
    expect(img).toBeInTheDocument();
  });

  it('toggles theme on click', () => {
    localStorage.setItem('appTheme', 'light');
    render(
      <ThemeProvider>
        <ThemeToggler />
      </ThemeProvider>
    );

    const toggler = screen.getByLabelText(/toggle color theme/i);

    expect(screen.getByAltText(/switch to dark mode/i)).toBeInTheDocument();

    fireEvent.click(toggler);
    expect(screen.getByAltText(/switch to light mode/i)).toBeInTheDocument();
    expect(localStorage.getItem('appTheme')).toBe('dark');

    fireEvent.click(toggler);
    expect(screen.getByAltText(/switch to dark mode/i)).toBeInTheDocument();
    expect(localStorage.getItem('appTheme')).toBe('light');
  });
});