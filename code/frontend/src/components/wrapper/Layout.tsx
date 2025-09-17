// Layout.tsx
import type { ReactNode, CSSProperties } from 'react';

type LayoutProps = {
  header?: ReactNode;
  aside?: ReactNode;
  mainContent?: ReactNode; // preferred slot for main content
  footer?: ReactNode;
  children?: ReactNode; // fallback if mainContent not provided
};

const PANEL_MAX_HEIGHT = '75vh'; // tweak as you like

export default function Layout({
  header,
  mainContent,
  aside,
  footer,
  children,
}: LayoutProps) {
  const main = mainContent ?? children;

  return (
    <div className="d-flex flex-column min-vh-100 w-100">
      {/* Header: full width */}
      <header className="w-100 mb-2 bg-body">{header}</header>

      {/* Content: full width */}
      <main className="w-100 container-fluid my-3">
        {/* Stack on mobile, row on lg+. Aside stays on top for mobile */}
        <div
          className="d-flex flex-column flex-lg-row gap-3"
          style={{ minHeight: 0 }}
        >
          {/* Aside */}
          <aside
            role="complementary"
            className="order-0 order-lg-2 bg-body rounded p-3 overflow-auto"
            style={{
              // 100% width when stacked (mobile/tablet)
              flexBasis: '100%',
              // 10% at lg+ (row)
              flex: '0 0 10%',
              maxHeight: PANEL_MAX_HEIGHT,
              minHeight: 0,
            }}
          >
            <div className="d-lg-none mb-2 fw-semibold">Filters</div>
            {aside}
          </aside>

          {/* Main */}
          <section
            role="main"
            className="order-1 order-lg-1 bg-body rounded p-3 flex-grow-1 overflow-auto"
            style={{
              // 100% width when stacked
              flexBasis: '100%',
              // 90% at lg+
              flex: '1 1 90%',
              maxHeight: PANEL_MAX_HEIGHT,
              minHeight: 0,
            }}
          >
            {main}
          </section>
        </div>
      </main>

      {/* Footer: full width */}
      <footer className="w-100 mt-auto bg-body">{footer}</footer>
    </div>
  );
}
