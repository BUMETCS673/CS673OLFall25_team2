// Type.tsx
// Copilot and ChatGPT assisted with this component
// 60% AI-generated, 40% human refined

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface TypeProps {
  onChange?: (value: string | null) => void;
}

export default function Type({ onChange }: TypeProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [dynamicTypes, setDynamicTypes] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLButtonElement>(null); // anchor for positioning
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        ref.current &&
        !ref.current.contains(t) &&
        overlayRef.current &&
        !overlayRef.current.contains(t)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  // Track computed position for the floating panel (align right edge to button; extend left)
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const el = anchorRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();

      const maxWidth = Math.min(260, window.innerWidth - 32);
      const left = Math.min(
        Math.max(rect.right - maxWidth, 16),
        window.innerWidth - maxWidth - 16
      );
      const top = Math.min(rect.bottom + 8, window.innerHeight - 16);

      setCoords({ top, left, width: maxWidth });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  const choose = (v: string | null) => {
    setValue(v);
    onChange?.(v);
    const evt = new CustomEvent('jobs:typeSelect', { detail: { value: v } });
    window.dispatchEvent(evt);
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{
        types: string[];
        selectedType: string | null;
      }>;
      setDynamicTypes(ce.detail.types);
      if (ce.detail.selectedType !== value) {
        if (!open) setValue(ce.detail.selectedType);
      }
    };
    window.addEventListener('jobs:types', handler);
    return () => window.removeEventListener('jobs:types', handler);
  }, [open, value]);

  return (
    <>
      <div className="position-relative" ref={ref}>
        <button
          type="button"
          className="btn btn-outline-secondary w-100 text-truncate filter-button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="listbox"
          ref={anchorRef}
        >
          {value ?? 'Type'}
        </button>
      </div>

      {/* Floating panel rendered in a portal so it can extend left outside the Aside */}
      {open &&
        createPortal(
          <div
            ref={overlayRef}
            className="shadow rounded border dropdown-panel p-3"
            style={{
              position: 'fixed',
              zIndex: 1060,
              top: coords.top,
              left: coords.left,
              width: coords.width,
              maxWidth: '100vw',
            }}
            role="dialog"
            aria-label="Type filter"
          >
            {/* Faded X to close */}
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-2"
              aria-label="Close"
              onClick={() => setOpen(false)}
            />

            <label className="form-label small mb-2">Type</label>

            {/* Dropdown menu (Bootstrap styles) */}
            <div
              role="listbox"
              className="list-group"
              style={{ maxHeight: 260, overflow: 'auto' }}
            >
              <button
                className="list-group-item list-group-item-action"
                onClick={() => choose(null)}
                role="option"
              >
                Any type
              </button>

              {dynamicTypes.map((t) => (
                <button
                  key={t}
                  className="list-group-item list-group-item-action"
                  onClick={() => choose(t)}
                  role="option"
                >
                  {t}
                </button>
              ))}
              {!dynamicTypes.length && (
                <div className="text-muted small p-2">
                  No types detected yet…
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
