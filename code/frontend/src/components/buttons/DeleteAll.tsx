/*
 AI-generated code: 0%

 Human code: 100% functions/classes: DeleteAll component, handleClick function

 Framework-generated code: 0%
*/

import React from 'react';
import './DeleteAll.css';

const DeleteAll: React.FC = () => {
  const handleClick = () => {
    if (window.confirm('Are you sure you want to delete all jobs? This action cannot be undone.')) {
      alert('All jobs deleted.');
    }
  };

  return (
    <button className="delete-all-button" onClick={handleClick}>
      Delete All
    </button>
  );
};

export default DeleteAll;
