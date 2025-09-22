// Layout.tsx
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
    <div className="d-flex flex-column min-vh-100">
      {/* Header: full width */}
      <header className="w-100 mb-2 bg-body">{header}</header>

      {/* Content */}
      <main className="container-fluid w-100 flex-grow-1 d-flex min-h-0">
        {/* Grid handles gutters so we don't overflow */}
        <div className="row g-3 flex-grow-1 min-h-0">
          {/* Aside: full width on mobile, fixed width on lg+ */}
          <aside
            role="complementary"
            className="col-12 order-0 order-lg-2 col-lg-auto bg-body overflow-auto"
            style={{
              // fixed column on lg+, responsive clamp so it never pushes main off-screen
              width: 'clamp(260px, 22vw, 320px)',
              minHeight: 0,
            }}
          >
            <div className="fw-semibold mb-3">FILTERS</div>
            {aside}
          </aside>

          {/* Main: takes the remaining width */}
          <section
            role="main"
            className="col-12 order-1 order-lg-1 col-lg bg-body rounded d-flex flex-column min-h-0"
            style={{
              // allow shrinking; prevents horizontal overflow from long content
              minWidth: 0,
            }}
          >
            {main}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-100 mt-0 bg-body">{footer}</footer>
    </div>
  );
}
