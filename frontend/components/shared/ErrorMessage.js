import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders an error message to the user
 */
const ErrorMessage = ({ error }) => {
  // Ensure that the passed in message is a string and not an object
  if (error && typeof error !== "string") {
    console.log("ERROR");
    console.dir(error);
    return null;
  }

  // If props were passed down
  if (error) {
    return (
      <div className="alert alert-danger">
        <p className="bold marg-bot-05">
          An error occured:
        </p>
        <p className="marg-bot-0 normal">
          { error }
        </p>
      </div>
    );
  }

  // Else, render nothing
  return null;
};

// Props validations
ErrorMessage.propTypes = {
  error: PropTypes.string,
};

export default ErrorMessage;
