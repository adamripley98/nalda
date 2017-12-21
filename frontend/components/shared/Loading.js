import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Component to render a spinning loading circle
 */
const Loading = () => {
  return (
    <div className="loading">
      <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" aria-hidden="true" />
    </div>
  );
};

export default Loading;
