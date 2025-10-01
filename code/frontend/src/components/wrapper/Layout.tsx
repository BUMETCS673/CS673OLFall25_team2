// Layout.tsx
// Author: ChatGPT and Pedro Ramirez
// ChatGPT generated the initial layout structure and logic
// Pedro refined the layout, added responsiveness, and ensured accessibility

import type { ReactNode } from 'react';

// Pedro's written code
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

  // initial structure and logic by ChatGPT
  // Pedro refined the layout, added responsiveness (Boostrap classes), and ensured accessibility
  return (
    <div className="d-flex flex-column vh-100">
      <header className="w-100 mb-0 bg-body">{header}</header>
      <main className="container-fluid w-100 flex-grow-1 d-flex min-h-0">
        <div className="row g-3 flex-grow-1 min-h-0 w-100">
          {aside && (
            <aside
              role="complementary"
              className="col-12 order-0 order-lg-2 col-lg-auto bg-body overflow-auto p-3"
              style={{ width: 'clamp(260px, 22vw, 320px)', minHeight: 0 }}
            >
              <div className="fw-semibold mb-3">FILTERS</div>
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
  );
}
