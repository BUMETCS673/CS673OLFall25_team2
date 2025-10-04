// FourZeroFour.tsx
// Copilot and ChatGPT assisted with this component
// 100% AI-generated

import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import logo from '../assets/logo.png';
import blackLogo from '../assets/blackLogo.png';
import Header from './headerAndFooter/Header';
import Footer from './headerAndFooter/Footer';

export default function FourZeroFour() {
  const { theme } = useTheme();

  return (
    <div className="d-flex flex-column vh-100">
      <Header />

      <main className="container flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center py-5">
        <div className="row w-100 justify-content-center">
          <div className="col-md-8 col-lg-6">
            {/* Logo and branding */}
            <div className="mb-3">
              <img
                src={theme === 'dark' ? blackLogo : logo}
                alt="CareerForge Logo"
                style={{ height: '70px', marginBottom: '1.5rem' }}
              />
            </div>

            {/* Animated 404 text */}
            <div
              className="position-relative mb-4"
              style={{ overflow: 'hidden' }}
            >
              <h1
                className="display-1 fw-bold text-info"
                style={{
                  textShadow:
                    theme === 'dark'
                      ? '2px 2px 8px rgba(0, 195, 255, 0.5)'
                      : '2px 2px 8px rgba(0, 0, 0, 0.1)',
                  animation: 'pulse 2s infinite ease-in-out',
                }}
              >
                404
              </h1>

              {/* Add inline styles for animation */}
              <style>
                {`
                  @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                  }
                  @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}
              </style>
            </div>

            <h2
              className="h3 mb-4"
              style={{ animation: 'fadeInUp 1s ease-out forwards' }}
            >
              Oops! Page Not Found
            </h2>

            <p
              className="lead mb-4 text-muted"
              style={{
                animation: 'fadeInUp 1s ease-out 0.2s forwards',
                opacity: 0,
              }}
            >
              The job posting you're looking for might have been moved, deleted,
              or never existed.
            </p>

            <div
              className="d-flex flex-column flex-md-row gap-3 justify-content-center"
              style={{
                animation: 'fadeInUp 1s ease-out 0.4s forwards',
                opacity: 0,
              }}
            >
              <Link to="/content" className="btn btn-info px-4 py-2">
                Browse Job Listings
              </Link>

              <Link
                to="/myJobs"
                className="btn btn-outline-secondary px-4 py-2"
              >
                View My Jobs
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
