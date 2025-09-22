import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return <div className="footer-container">CS673 | {currentYear}</div>;
};

export default Footer;
