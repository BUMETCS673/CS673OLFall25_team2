/*
 AI-generated code: 0%

 Human code: 100% functions/classes: Location component, handleInputChange function, handleClearInput function

 Framework-generated code: 0%
*/


import React, { useState } from 'react';
import './Location.css';

const Location: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [locationValue, setLocationValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationValue(e.target.value);
  };

  const handleClearInput = () => {
    setLocationValue('');
  };

  // if isOpen is false，show the icon
  if (!isOpen) {
    return (
      <button className="filter-button" onClick={() => setIsOpen(true)}>
        Location
      </button>
    );
  }

  // if isOpen is true，show the input box
  return (
    <div className="location-input-container">
      <div className="location-header">
        <span className="location-title">Location</span>
        <button className="close-button" onClick={() => setIsOpen(false)}>
          &times;
        </button>
      </div>
      <div className="input-with-clear">
        <input
          type="text"
          className="location-input"
          placeholder="City, state, or country"
          value={locationValue}
          onChange={handleInputChange}
          autoFocus
        />
        {/* Clear button only appers when user types location value */}
        {locationValue && (
          <button className="clear-input-button" onClick={handleClearInput}>
            &times; {/* "x" as clear location value button */}
          </button>
        )}
      </div>
    </div>
  );
};

export default Location;
