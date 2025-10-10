/*
 AI-generated code: 20% Formatting help with GPT

 Human code: 80% functions/classes: Footer component

 Framework-generated code: 0%
*/

import './Footer.css';
import { useTheme } from '../../theme/ThemeContext';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();

  return (
    <div
      className="footer-container"
      style={{ backgroundColor: theme === 'light' ? 'white' : '#1A1A1A' }}
    >
      CS673OLFall25-Team2 | {currentYear} |{' '}
      <span className="university-title">Boston University</span>
    </div>
  );
};

export default Footer;
