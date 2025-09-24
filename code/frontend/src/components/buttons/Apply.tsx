/*
 AI-generated code: 0%

 Human code: 100% functions/classes: ApplyProps interface, Apply React functional component

 Framework-generated code: 0%
*/


import React from 'react';
import './Apply.css';

interface ApplyProps {
  onClick: () => void;
}

const Apply: React.FC<ApplyProps> = ({ onClick }) => {
  return (
    <button className="apply-button" onClick={onClick}>
      Apply
    </button>
  );
};

export default Apply;
