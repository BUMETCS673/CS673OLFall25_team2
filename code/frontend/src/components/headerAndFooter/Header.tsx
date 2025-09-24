/*
 AI-generated code: 20% Formatting help with GPT

 Human code: 80% functions/classes: Header component

 Framework-generated code: 0%
*/


import React from 'react';
import './Header.css';
import logo from '../../assets/logo.png';

const Header: React.FC = () => {
  return (
    <header className="header-container">
      <div className="header-inner">
        <div className="logo-container">
          <img src={logo} alt="CareerForge Logo" className="logo-image" />
        </div>
        <div className="welcome-text">Welcome</div>
      </div>
    </header>
  );
};

export default Header;
