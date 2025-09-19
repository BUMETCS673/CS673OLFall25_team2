import { useTheme } from '../../theme/ThemeContext';
import sunImage from '../../assets/sun.png';
import moonImage from '../../assets/moon.jpg';

/**
 * Theme toggle button for switching between light and dark mode.
 * Updates global font/background colors and persists preference.
 */
export default function ThemeToggler() {
  const { theme, toggle } = useTheme();

  return (
    <div className="w-100" onClick={toggle} aria-label="Toggle color theme">
      {theme === 'light' ? (
        <img
          src={moonImage}
          alt="Switch to dark mode"
          style={{ width: '40px', height: '40px' }}
        />
      ) : (
        <img
          src={sunImage}
          alt="Switch to light mode"
          style={{ width: '40px', height: '40px' }}
        />
      )}
    </div>
  );
}
