/*
 AI-generated code: 0%
 Human code: 100% functions/classes: MyJobs component
 Framework-generated code: 0%
*/

import React from 'react';
import './MyJobs.css';

interface MyJobsButtonProps {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

const MyJobsButton: React.FC<MyJobsButtonProps> = ({
  onClick,
  className = '',
  ariaLabel = 'Navigate to My Jobs page',
}) => {
  return (
    <button
      className={`my-jobs-button ${className}`.trim()}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      My Jobs
    </button>
  );
};

export default MyJobsButton;
