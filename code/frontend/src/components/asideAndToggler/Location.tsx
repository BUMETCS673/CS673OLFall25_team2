import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** 
 * Location filter component used in the Aside panel.
 * Clicking the button opens an inline input prompt.
 */
interface LocationProps {
  onChange?: (value: string | null) => void;
}

export default function Location({ onChange }: LocationProps) {
  const [open, setOpen] = useState(false);                 // controls the input panel
  const [value, setValue] = useState<string | null>(null); // committed selection
  const [draft, setDraft] = useState("");                  // text typed before Apply
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);       // anchor for positioning
  const overlayRef = useRef<HTMLDivElement>(null);

  // Track computed position for the floating panel
  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0, left: 0, width: 0,
  });

  // Close when clicking outside the component (works for both the button container and the floating panel)
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(t) &&
        overlayRef.current &&
        !overlayRef.current.contains(t)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Compute and update panel position relative to the button
  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const el = anchorRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();

      // Desired max width; still responsive on very small screens
      const maxWidth = Math.min(520, window.innerWidth - 32); // keep 16px margins
      // Align the panel's RIGHT edge to the button's right so it extends LEFT
      const left = Math.min(
        Math.max(rect.right - maxWidth, 16),            // not past left gutter
        window.innerWidth - maxWidth - 16               // not past right gutter
      );
      const top = Math.min(rect.bottom + 8, window.innerHeight - 16); // small offset below button

      setCoords({ top, left, width: maxWidth });
    };

    updatePosition();
    // Reposition on resize/scroll to stay anchored
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  // Autofocus the input when the panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  const toggleOpen = () => {
    setDraft(value ?? "");  // start from current selection
    setOpen(o => !o);
  };

  const apply = () => {
    const next = draft.trim() || null;
    setValue(next);
    onChange?.(next);
    setOpen(false);
  };

  const clear = () => {
    setDraft("");
    setValue(null);
    onChange?.(null);
    setOpen(false);
  };

  return (
    <>
      <div className="position-relative" ref={containerRef}>
        <button
          type="button"
          className="btn btn-outline-secondary w-100 text-truncate"
          onClick={toggleOpen}
          aria-expanded={open}
          aria-haspopup="dialog"
          ref={anchorRef}
        >
          {value ?? "Location"}
        </button>
      </div>

      {open &&
        createPortal(
          <div
            ref={overlayRef}
            role="dialog"
            aria-label="Location input"
            // Render outside the Aside so it can extend left; fixed so it anchors to viewport coords
            className="shadow rounded border bg-body p-3"
            style={{
              position: "fixed",
              zIndex: 1060,           // above dropdowns/headers
              top: coords.top,
              left: coords.left,
              width: coords.width,
              maxWidth: "100vw",
            }}
          >
            {/* Faded "X" close control in the corner */}
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-2"
              aria-label="Close"
              onClick={() => setOpen(false)}
            />

            <label htmlFor="locationInput" className="form-label small mb-1">
              Location
            </label>

            {/* Stacked layout to avoid squish in a narrow aside */}
            <div className="d-flex flex-column gap-2">
              <input
                id="locationInput"
                ref={inputRef}
                type="search"
                className="form-control"
                placeholder="City, state, or country"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") apply();   // commit
                  if (e.key === "Escape") setOpen(false); // cancel/close
                }}
              />
              <div className="d-flex justify-content-end gap-2">
                {draft && (
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={clear}>
                    Clear
                  </button>
                )}
                <button type="button" className="btn btn-primary btn-sm" onClick={apply}>
                  Apply
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}