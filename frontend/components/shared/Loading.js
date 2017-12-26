import React from 'react';

/**
 * Component to render a spinning loading circle
 */
const Loading = () => {
  return (
    <div className="loading">
      <div className="loader reverse" />
      <div className="loader" />
    </div>
  );
};

export default Loading;
