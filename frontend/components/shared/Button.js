import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Renders an error message to the user
 */
const Button = ({ to, text }) => (
  <Link className="btn btn-primary marg-bot-15" to={ to ? to : "/" }>
    { text ? text : "Back to home" }
  </Link>
);

// Props validations
Button.propTypes = {
  to: PropTypes.string,
  text: PropTypes.string,
};

export default Button;
