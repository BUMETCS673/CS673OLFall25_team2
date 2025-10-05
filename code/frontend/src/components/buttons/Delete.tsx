/*
 AI-generated code: 20% Formatting help with GPT

 Human code: 80% functions/classes: DeleteButtonProps interface, Apply React functional component

 Framework-generated code: 0%
*/

import React from 'react';
import './Delete.css';

interface DeleteButtonProps {
  onClick: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  return (
    <button
      className="delete-button"
      onClick={onClick}
      aria-label="Delete item"
    >
      &times;
    </button>
  );
};

export default DeleteButton;
