import Field from './Field';
import Location from './Location';
import Type from './Type';
import ThemeToggler from './themeToggler';

/*
 AI-generated code: 80% (tool: ChatGPT, modified and adapted,
   functions: Aside,
   classes: none,
   AI chat links: https://chatgpt.com/share/68cdcba0-1218-8006-87a6-66d632a41ec8 )
 Human code: 15% (functions: small structural edits, comments, import/casing fixes; classes: none)
 Framework-generated code: 5% (tool: Vite/React app template)
*/
export default function Aside() {
  return (
    <div className="d-flex flex-column gap-3" aria-label="Filters and theme">
      <div
        className="d-flex flex-column gap-2"
        role="group"
        aria-label="Filters"
      >
        <Field onChange={(v) => console.log('field:', v)} />
        <Location onChange={(v) => console.log('location:', v)} />
        <Type onChange={(v) => console.log('type:', v)} />
      </div>

      {/* Theme toggle button (Task 3) */}
      <ThemeToggler />
    </div>
  );
}
