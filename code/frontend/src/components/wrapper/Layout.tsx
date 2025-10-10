//Layout.tsx
// Copilot assisted with this component
// 60% AI-generated, 40% human refined

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import './Layout.css';

type LayoutProps = {
  header?: ReactNode;
  aside?: ReactNode;
  mainContent?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
};

export default function Layout({
  header,
  mainContent,
  aside,
  footer,
  children,
}: LayoutProps) {
  const main = mainContent ?? children;

  // State to track viewport width with SSR safety
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Effect to handle window resize and initialize
  useEffect(() => {
    setIsMounted(true);
    setIsDesktop(window.innerWidth >= 992); // 992px is Bootstrap's lg breakpoint

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 992);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Only conditionally render after component is mounted in client
  // This prevents hydration errors due to SSR vs client-side differences
  if (!isMounted) {
    // Return a simple placeholder with same structure until client-side hydration
    return (
      <div id="mobile-layout-container">
        {header}
        <div className="filters-toggle-container">
          <button
            className="filters-toggle-button btn btn-sm btn-outline-secondary"
            aria-expanded={false}
            aria-controls="filters-dropdown"
          >
            Show Filters
          </button>
        </div>
        <div id="filters-dropdown" className="mobile-filters-container closed">
          <div id="layout-aside">{aside}</div>
        </div>
        <div id="layout-main">{main}</div>
        <div id="layout-footer">{footer}</div>
      </div>
    );
  }

  // Once mounted, conditionally render based on viewport size
  return isDesktop ? (
    <div id="desktop-layout-container" className="d-flex flex-column vh-100">
      <header className="w-100 mb-0 bg-body">{header}</header>
      <main className="container-fluid w-100 flex-grow-1 d-flex min-h-0">
        <div className="row g-3 flex-grow-1 min-h-0 w-100">
          {aside && (
            <aside
              role="complementary"
              className="col-12 order-0 order-lg-2 col-lg-auto bg-body overflow-auto p-3"
              style={{ width: 'clamp(260px, 22vw, 320px)', minHeight: 0 }}
            >
              {aside}
            </aside>
          )}

          <section
            role="main"
            className="col-12 order-1 order-lg-1 col-lg bg-body rounded d-flex flex-column min-h-0"
            style={{ minWidth: 0 }}
          >
            {main}
          </section>
        </div>
      </main>

      <footer className="w-100 mt-0 bg-body">{footer}</footer>
    </div>
  ) : (
    <div id="mobile-layout-container">
      {header}
      <div className="filters-toggle-container">
        <button
          className="filters-toggle-button btn btn-sm btn-outline-secondary"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          aria-expanded={isFiltersOpen}
          aria-controls="filters-dropdown"
        >
          {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      <div
        id="filters-dropdown"
        className={`mobile-filters-container ${
          isFiltersOpen ? 'open' : 'closed'
        }`}
      >
        <div id="layout-aside">{aside}</div>
      </div>
      <div id="layout-main">{main}</div>
      <div id="layout-footer">{footer}</div>
    </div>
  );
}
