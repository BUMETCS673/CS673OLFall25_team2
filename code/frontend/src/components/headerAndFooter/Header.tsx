/*
 AI-generated code: 20% Formatting help with GPT

 Human code: 80% functions/classes: Header component

 Framework-generated code: 0%
*/

import React from 'react';
import './Header.css';
import logo from '../../assets/logo.png';
import blackLogo from '../../assets/blackLogo.png';
import { useTheme } from '../../theme/ThemeContext';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { theme } = useTheme();
  const handleLogout = () => {
    try {
      localStorage.removeItem('jwt');
      localStorage.removeItem('auth');
      sessionStorage.clear();
    } catch {}
  };

  return (
    <header className="header-container">
      <div className="header-inner">
        <div className="logo-container">
          <Link to="/login" onClick={handleLogout}>
            <img
              src={theme === 'dark' ? blackLogo : logo}
              alt="CareerForge Logo"
              className="logo-image"
            />
          </Link>
        </div>
        <h6 className="welcome-text fw-bold text-capitalize">
          Track your applications.{' '}
          <span className="text-info">Land the job!</span>
        </h6>
      </div>
    </header>
  );
};

export default Header;
