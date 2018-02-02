import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders the head component of an HTML page
 */
const Head = ({ title }) => {
  if (title) {
    document.title = "Nalda | " + title;
  }

  return null;
};

// Props validations
Head.propTypes = {
  title: PropTypes.string,
};

export default Head;
