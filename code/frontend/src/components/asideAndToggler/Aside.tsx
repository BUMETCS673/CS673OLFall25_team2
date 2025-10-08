// Aside.tsx
// Copilot and ChatGPT assisted with this component
// 60% AI-generated, 40% human refined

import { useLocation, useNavigate } from 'react-router-dom';
import Field from './Field';
import Type from './Type';
import ThemeToggler from './themeToggler';

type AsideProps = {
  myJobsView?: 'saved' | 'applied';
  onMyJobsViewChange?: (v: 'saved' | 'applied') => void;
};

export default function Aside({ myJobsView, onMyJobsViewChange }: AsideProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isMyJobs = pathname.startsWith('/myJobs');
  const buttonLabel = isMyJobs ? 'Jobs List' : 'My Jobs';
  const buttonClass = 'btn btn-info w-100 text-truncate';

  const onButtonClick = () => {
    if (isMyJobs) navigate('/content');
    else navigate('/myJobs');
  };

  const showMyJobsControls =
    typeof myJobsView !== 'undefined' &&
    typeof onMyJobsViewChange === 'function';

  return (
    <div
      className="d-flex flex-column h-100"
      aria-label="Filters and theme"
      style={{ paddingBottom: '80px' }}
    >
      <div
        className="d-flex flex-column gap-2 mb-2"
        role="group"
        aria-label="Filters"
      >
        <Field />
        <Type />
        <button
  type="button"
  className={`${buttonClass} filter-button d-none d-lg-block`}
  onClick={onButtonClick}
>
  {buttonLabel}
</button>
        {showMyJobsControls && (
          <div className="mb-1" role="group" aria-label="My Jobs view"></div>
        )}
      </div>
      <div className="mt-auto pt-4">
        <ThemeToggler />
      </div>
    </div>
  );
}
