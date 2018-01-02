import React from 'react';
import PropTypes from 'prop-types';

/**
 * Wrapper component of medium width which renders whatever component you put
 * within it. This is used, for example, on login and registration forms.
 */
const Medium = ({ children }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
          { children }
        </div>
      </div>
    </div>
  );
};

Medium.propTypes = {
  children: PropTypes.object,
};

export default Medium;
