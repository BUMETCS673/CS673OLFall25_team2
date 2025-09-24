/*
 AI-generated code: 0%

 Human code: 100% functions/classes: Field component, handleClick function

 Framework-generated code: 0%
*/


import React from 'react';
import './Field.css';

const Field: React.FC = () => {
  return (
    <select className="filter-select">
      <option value="" disabled selected hidden>Field</option>
      
      {/* Options can be modified later. */}
      <option value="engineering">Engineering</option>
      <option value="design">Design</option>
      <option value="marketing">Marketing</option>
      <option value="sales">Sales</option>
    </select>
  );
};

export default Field;
