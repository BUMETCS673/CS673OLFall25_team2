import { useTheme } from '../../theme/ThemeContext';
import sunImage from '../../assets/sun.png';
import moonImage from '../../assets/moon.jpg';

/*
 AI-generated code: 80% (tool: ChatGPT, modified and adapted,
   functions: ThemeToggler,
   classes: none,
   AI chat links: https://chatgpt.com/share/68cdcba0-1218-8006-87a6-66d632a41ec8 )
 Human code (James Rose): 15% (functions: casing/paths, comments; classes: none)
 Framework-generated code: 5% (tool: Vite/React)
*/

// Theme toggle button component
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
