import React from 'react';
import PropTypes from 'prop-types';

/**
 * Render a card with a simple message in gray text
 */
const Blurb = ({ message }) => (
  <div className="card pad-1 border marg-top-1 gray-text">
    { message }
  </div>
);

// Prop validations
Blurb.propTypes = {
  message: PropTypes.string,
};

export default Blurb;
