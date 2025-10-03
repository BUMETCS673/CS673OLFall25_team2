import { useLocation, useNavigate } from 'react-router-dom';
import Field from './Field';
import Type from './Type';
import ThemeToggler from './themeToggler';
// import MyJobsDropdown from './MyJobsDropdown'; // (kept available if you still use it elsewhere)

/*
 AI-generated code: ~20%
   - Tool: ChatGPT (link: https://chatgpt.com/share/68cdcba0-1218-8006-87a6-66d632a41ec8)
   - Functions/classes: initial layout scaffolding idea and Bootstrap grid guidance
 Human code: ~75%
   - Functions/classes: Layout component implementation, responsive aside handling,
     custom clamp width for filters, integration of header/footer/main props
 Framework-generated code: ~5%
   - Tool: Vite/React (basic project and JSX boilerplate)
*/

type AsideProps = {
  myJobsView?: 'saved' | 'applied';
  onMyJobsViewChange?: (v: 'saved' | 'applied') => void;
};

export default function Aside({ myJobsView, onMyJobsViewChange }: AsideProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isMyJobs = pathname.startsWith('/myJobs');
  const buttonLabel = isMyJobs ? 'Jobs List' : 'My Jobs';
  // CHANGED: always use solid red button on both pages
  const buttonClass = 'btn btn-info w-100 text-truncate';

  const onButtonClick = () => {
    if (isMyJobs) navigate('/content');
    else navigate('/myJobs');
  };

  // Only show dropdown if props are provided (not on MyJobs page per your request)
  const showMyJobsControls =
    typeof myJobsView !== 'undefined' &&
    typeof onMyJobsViewChange === 'function';

  return (
    <div className="d-flex flex-column gap-3" aria-label="Filters and theme">
      <div
        className="d-flex flex-column gap-2"
        role="group"
        aria-label="Filters"
      >
        <Field onChange={(v) => console.log('field:', v)} />
        <Type onChange={(v) => console.log('type:', v)} />

        <button
          type="button"
          className={`${buttonClass} filter-button`}
          onClick={onButtonClick}
        >
          {buttonLabel}
        </button>

        {/* Keep this guard so it won't show on MyJobs now */}
        {showMyJobsControls && (
          <div className="mb-1" role="group" aria-label="My Jobs view">
            {/* <MyJobsDropdown currentView={myJobsView!} onChange={onMyJobsViewChange!} /> */}
          </div>
        )}
      </div>

      <ThemeToggler />
    </div>
  );
}
