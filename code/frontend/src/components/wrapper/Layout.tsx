//Layout.tsx
// Copilot assisted with this component
// 60% AI-generated, 40% human refined

import type { ReactNode } from 'react';

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

  return (
    <div className="d-flex flex-column vh-100">
      <header className="w-100 mb-0 bg-body">{header}</header>
      <main className="container-fluid w-100 flex-grow-1 d-flex min-h-0">
        <div className="row g-3 flex-grow-1 min-h-0 w-100">
          {aside && (
  <>
    {/* Visible on large screens */}
    <aside
      role="complementary"
      className="col-12 col-lg-3 d-none d-lg-block bg-body overflow-auto p-3"
      style={{ maxHeight: '100dvh', minHeight: 0 }}
    >
      <div className="fw-semibold mb-3">FILTERS</div>
      {aside}
    </aside>

    {/* Mobile offcanvas drawer */}
    <div
      className="offcanvas offcanvas-start d-lg-none"
      tabIndex={-1}
      id="filtersOffcanvas"
      aria-labelledby="filtersOffcanvasLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="filtersOffcanvasLabel">
          Filters
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">{aside}</div>
    </div>
  </>
)}

          <section
  role="main"
  className="col-12 col-lg bg-body rounded d-flex flex-column min-h-0"
  style={{ minWidth: 0 }}
>
  {/* Mobile top buttons */}
  <div className="d-lg-none d-flex justify-content-between align-items-center p-2 gap-2 sticky-top bg-body border-bottom">
    {/* Toggle Jobs List / My Jobs */}
    <button
      className="btn btn-outline-primary flex-fill"
      type="button"
      onClick={() => {
        const isMyJobs = window.location.pathname.startsWith('/myJobs');
        window.location.href = isMyJobs ? '/content' : '/myJobs';
      }}
    >
      {window.location.pathname.startsWith('/myJobs')
        ? 'Jobs List'
        : 'My Jobs'}
    </button>

    {/* Open Filters Offcanvas */}
    <button
      className="btn btn-outline-info flex-fill"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#filtersOffcanvas"
      aria-controls="filtersOffcanvas"
    >
      Filters
    </button>
  </div>

  {/* Main content area (fills below buttons) */}
  <div className="flex-grow-1 overflow-auto min-h-0">{main}</div>
</section>
        </div>
      </main>

      <footer className="w-100 mt-0 bg-body">{footer}</footer>
    </div>
  );
}
