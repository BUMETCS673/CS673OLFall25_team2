// Field.tsx
// Copilot and ChatGPT assisted with this component
// 85% AI-generated, 10% human refined, 5% framework-generated

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface FieldProps {
  onChange?: (value: string | null) => void;
}

export default function Field({ onChange }: FieldProps) {
  const [open, setOpen] = useState(false); // controls dropdown open/close
  const [value, setValue] = useState<string | null>(null);
  const [dynamicDepartments, setDynamicDepartments] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLButtonElement>(null); // anchor for positioning the floating panel
  const overlayRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState(''); // text typed to filter the list

  // Click-outside detection: close dropdown if user clicks elsewhere
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
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
  }>({
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

      const maxWidth = Math.min(520, window.innerWidth - 32);
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
    onChange?.(v); // bubble up to parent
    // Broadcast department selection so JobsViewList can filter
    const evt = new CustomEvent('jobs:departmentSelect', {
      detail: { value: v },
    });
    window.dispatchEvent(evt);
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{
        departments: string[];
        selectedDepartment: string | null;
      }>;
      setDynamicDepartments(ce.detail.departments);
      if (!open) {
        if (ce.detail.selectedDepartment !== value) {
          setValue(ce.detail.selectedDepartment);
        }
      }
    };
    window.addEventListener('jobs:departments', handler);
    return () => window.removeEventListener('jobs:departments', handler);
  }, [open, value]);

  // Filter departments live as the user types
  const filtered = dynamicDepartments.filter((f) =>
    f.toLowerCase().includes(draft.toLowerCase())
  );

  return (
    <>
      <div className="position-relative" ref={ref}>
        <button
          type="button"
          className="btn btn-outline-secondary w-100 text-truncate filter-button"
          onClick={() => {
            setDraft(value ?? '');
            setOpen((o) => !o);
          }}
          aria-expanded={open}
          aria-haspopup="listbox"
          ref={anchorRef}
        >
          {value ?? 'Field'}
        </button>
      </div>

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
            aria-label="Field filter"
          >
            {/* Faded X to close */}
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-2"
              aria-label="Close"
              onClick={() => setOpen(false)}
            />

            <label htmlFor="fieldFilterInput" className="form-label small mb-1">
              Field
            </label>

            {/* Filter input */}
            <input
              id="fieldFilterInput"
              type="search"
              className="form-control mb-2"
              placeholder="Type to filter…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(false);
                if (e.key === 'Enter') {
                  // On Enter, pick the first filtered option (or clear if none)
                  if (filtered.length > 0) choose(filtered[0]);
                }
              }}
            />

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
                Any field
              </button>

              {filtered.length === 0 && (
                <div
                  className="list-group-item text-muted"
                  role="option"
                  aria-disabled="true"
                >
                  {dynamicDepartments.length
                    ? 'No matches'
                    : 'No departments yet…'}
                </div>
              )}

              {filtered.map((f) => (
                <button
                  key={f}
                  className="list-group-item list-group-item-action"
                  onClick={() => choose(f)}
                  role="option"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
