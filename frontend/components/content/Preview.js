import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Renders an error message to the user
 */
const Preview = ({ _id, title, subtitle, image, isArticle, isListing, isVideo }) => {
  // Find the type of the content
  let type = "";
  if (isArticle) {
    type = "articles";
  } else if (isListing) {
    type = "listings";
  } else if (isVideo) {
    type = "videos";
  }

  // Return the content preview
  return (
    <div className="col-6 col-lg-3" key={ _id } >
      <Link to={ `/${type}/${_id}` }>
        <div className="article-preview">
          <div
            className="background-image"
            style={{ backgroundImage: `url(${image})`}}
          />
          <h2 className="title">
            { title }
          </h2>
          <h6 className="subtitle">
            { subtitle }
          </h6>
        </div>
      </Link>
    </div>
  );
};

// Props validations
Preview.propTypes = {
  _id: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.string,
  isListing: PropTypes.bool,
  isVideo: PropTypes.bool,
  isArticle: PropTypes.bool,
};

export default Preview;
