import React from 'react';

/**
 * Wrapper component with a blue-gray background.
 */
const GrayWrapper = ({ children }) => {
  return (
    <div className="gray-wrapper">
      { children }
    </div>
  );
};

export default GrayWrapper;
