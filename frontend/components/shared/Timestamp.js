// Import frameworks
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

/**
 * Component to render a timestamp with created at and updated at fields
 */
const Timestamp = ({ createdAt, updatedAt }) => {
  // Timestamp styles
  const style = {
    color: "#BEBEBE",
    fontSize: "0.8rem",
    fontStyle: "italic",
  };

  // If no props are passed in or only updatedAt passed in, return null
  if (!createdAt) {
    return null;
  }

  // Else, build up the timestamp string
  // Construct the timstamp string
  let timestamp = "Created ";
  timestamp += moment(createdAt).fromNow() + ".";

  // Add updated if applicable
  if (createdAt !== updatedAt) {
    timestamp += (" Updated " + moment(updatedAt).fromNow() + ".");
  }

  // Return the timestamp in a paragraph tag
  return (
    <p className="timestamp" style={ style }>
      { timestamp }
    </p>
  );
};

Timestamp.propTypes = {
  createdAt: PropTypes.number,
  updatedAt: PropTypes.number,
};

export default Timestamp;
