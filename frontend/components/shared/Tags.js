// Import frameworks
import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

/**
 * Component which leverages react hemlet to set meta tags of the page
 * TODO more tags
 */
const Tags = ({title, description, img, keywords}) => {
  const tags = {
    title: title ? `Nalda | ${title}` : "Nalda",
  };

  return (
    <Helmet>
      <title>{tags.title}</title>
    </Helmet>
  );
};

// Prop validations
Tags.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  img: PropTypes.string,
  keywords: PropTypes.string,
};

// Export
export default Tags;
