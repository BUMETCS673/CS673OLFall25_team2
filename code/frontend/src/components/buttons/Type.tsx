/*
 AI-generated code: 20% Formatting help with GPT

 Human code: 80% functions/classes: Type component

 Framework-generated code: 0%
*/


import React from 'react';
import './Type.css';

const Type: React.FC = () => {
  return (
    <select className="filter-select">
      <option value="" disabled selected hidden>Type</option>
      
      {/* Options can be modified later. */}
      <option value="full-time">Full-time</option>
      <option value="part-time">Part-time</option>
      <option value="contract">Contract</option>
      <option value="internship">Internship</option>
    </select>
  );
};

export default Type;
