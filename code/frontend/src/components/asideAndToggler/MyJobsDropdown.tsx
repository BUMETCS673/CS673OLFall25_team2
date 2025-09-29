import React, { useState, useRef, useEffect } from "react";

/*
 AI-generated code: ~40% (tool: ChatGPT, adapted; chat link: https://chatgpt.com/share/68d6d0b7-3ca8-8006-a7b7-223d71795542)
 Human code: ~55% (dropdown state handling, click-outside detection, parent onChange integration)
 Framework-generated code: ~5% (Vite + React scaffolding conventions)
*/

interface MyJobsDropdownProps {
  currentView: "saved" | "applied";
  onChange: (view: "saved" | "applied") => void;
}

const MyJobsDropdown: React.FC<MyJobsDropdownProps> = ({ currentView, onChange }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (view: "saved" | "applied") => {
    onChange(view);   // tell parent
    setOpen(false);   // close dropdown
  };

  return (
    <div className="dropdown">
      {/* Toggle button */}
      <button
        ref={buttonRef}
        className="btn btn-outline-danger dropdown-toggle"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {currentView === "saved" ? "Saved Jobs" : "Applied Jobs"}
      </button>

      {/* Dropdown menu */}
      {open && (
        <ul
          className="dropdown-menu show"
          role="listbox"
          aria-label="My Jobs view"
        >
          <li>
            <button
              className="dropdown-item"
              role="option"
              aria-selected={currentView === "saved"}
              onClick={() => handleSelect("saved")}
            >
              Saved
            </button>
          </li>
          <li>
            <button
              className="dropdown-item"
              role="option"
              aria-selected={currentView === "applied"}
              onClick={() => handleSelect("applied")}
            >
              Applied
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default MyJobsDropdown;