import React from "react";
import Field from "./Field";
import Location from "./Location";
import Type from "./Type";
import ThemeToggler from "./ThemeToggler";

/**
 * Aside container for filters + theme toggle.
 * Styling (border, bg, spacing) is applied by the Layout wrapper,
 * so this component just provides clean structure for filters and theme toggle.
 */
export default function Aside() {
  return (
    <div className="d-flex flex-column gap-3" aria-label="Filters and theme">
      <h2 className="h5 m-0">Refine</h2>

      <div className="d-flex flex-column gap-2" role="group" aria-label="Filters">
        <Field onChange={(v) => console.log("field:", v)} />
        <Location onChange={(v) => console.log("location:", v)} />
        <Type onChange={(v) => console.log("type:", v)} />
      </div>

      {/* Theme toggle button (Task 3) */}
      <ThemeToggler />
    </div>
  );
}