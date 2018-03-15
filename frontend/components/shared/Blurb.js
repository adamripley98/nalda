import React from 'react';
import PropTypes from 'prop-types';

/**
 * Render a card with a simple message in gray text
 */
const Blurb = ({ message, margBot }) => (
  <div className={margBot ? "card pad-1 border gray-text marg-bot-1" : "card pad-1 border gray-text"}>
    { message }
  </div>
);

// Prop validations
Blurb.propTypes = {
  message: PropTypes.string,
  margBot: PropTypes.bool,
};

export default Blurb;
