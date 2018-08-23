import React from 'react';
import PropTypes from 'prop-types';

const Requirements = ({ requirements }) => {
  if (!requirements || !requirements.length) return null;

  return (
    <p className="requirements">
      <strong>
        Requirements:
      </strong>
      <br />
      {requirements.map(req => "-" + req + '\n')}
    </p>
  );
};

Requirements.defaultProps = {
  requirements: [],
};

Requirements.propTypes = {
  requirements: PropTypes.array,
};

export default Requirements;
