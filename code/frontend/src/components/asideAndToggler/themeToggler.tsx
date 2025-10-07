// themeToggler.tsx
// Copilot and ChatGPT assisted with this component
// 60% AI-generated, 40% human refined

import { useTheme } from '../../theme/ThemeContext';
import sunImage from '../../assets/sun.png';
import moonImage from '../../assets/moon.png';

export default function ThemeToggler() {
  const { theme, toggle } = useTheme();

  return (
    <div
      className="w-100 d-flex justify-content-end"
      onClick={toggle}
      aria-label="Toggle color theme"
    >
      {theme === 'light' ? (
        <img
          src={moonImage}
          alt="Switch to dark mode"
          style={{ width: '47px', height: '47px' }}
          className="user-select-none me-3"
        />
      ) : (
        <img
          src={sunImage}
          alt="Switch to light mode"
          style={{ width: '47px', height: '47px' }}
          className="user-select-none me-3"
        />
      )}
    </div>
  );
}
