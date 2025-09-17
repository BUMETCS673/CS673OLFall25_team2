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
