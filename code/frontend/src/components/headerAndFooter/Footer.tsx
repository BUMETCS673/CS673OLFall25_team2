import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      CS673 | {currentYear}
    </footer>
  );
};

export default Footer;
