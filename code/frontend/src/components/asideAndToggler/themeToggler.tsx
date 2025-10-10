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
      onClick={toggle}
      aria-label="Toggle color theme"
      style={{
        cursor: 'pointer',
        width: 'fit-content',
        float: 'right',
        marginBottom: '1.5rem',
      }}
    >
      {theme === 'light' ? (
        <img
          src={moonImage}
          alt="Switch to dark mode"
          style={{ width: '40px', height: '40px' }}
          className="user-select-none"
        />
      ) : (
        <img
          src={sunImage}
          alt="Switch to light mode"
          style={{ width: '40px', height: '40px' }}
          className="user-select-none"
        />
      )}
    </div>
  );
}
