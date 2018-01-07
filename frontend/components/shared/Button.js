import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Renders a button
 */
const Button = ({ to, text, left, right }) => (
  <Link className="btn btn-primary marg-bot-15" to={ to ? to : "/" }>
    { text ? (
      <span>
        {
          left && <i className="fa fa-chevron-left" aria-hidden="true" />
        }
        { text }
        {
          right && <i className="fa fa-chevron-right" aria-hidden="true" />
        }
      </span>
    ) : (
      <span>
        <i className="fa fa-chevron-left" aria-hidden="true" />
        Back to home
      </span>
    ) }
  </Link>
);

// Props validations
Button.propTypes = {
  to: PropTypes.string,
  text: PropTypes.string,
  right: PropTypes.bool,
  left: PropTypes.bool,
};

export default Button;
