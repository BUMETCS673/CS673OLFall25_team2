/*
 AI-generated code: 20% Formatting help with GPT

 Human code: 80% functions/classes: SaveProps interface, Save component, handleClick function

 Framework-generated code: 0%
*/


import React, { useState } from 'react';
import './Save.css';

interface SaveProps {
  onClick: () => void; 
}

const Save: React.FC<SaveProps> = ({ onClick }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleClick = () => {
    setIsSaved(currentValue => !currentValue);

    onClick();
  };

  return (
    <button
      className={`save-button ${isSaved ? 'saved' : ''}`}
      onClick={handleClick}
    >
      {isSaved ? '✓ Saved' : 'Save'}
    </button>
  );
};

export default Save;
