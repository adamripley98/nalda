import React from 'react';
import PropTypes from 'prop-types';

/**
 * Wrapper component of thin width which renders whatever component you put
 * within it. This is used, for example, on login and registration forms.
 */
const Thin = ({ children }) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
          { children }
        </div>
      </div>
    </div>
  );
};

Thin.propTypes = {
  children: PropTypes.object,
};

export default Thin;
