import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

/**
 * Renders an error message to the user
 */
const Preview = ({ _id, title, subtitle, image, isArticle, isListing, isVideo, isThin, timestamp }) => {
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
    <div className={ isThin ? "col-12 col-md-6" : "col-6 col-xl-3" } key={ _id } >
      <Link to={ `/${type}/${_id}` }>
        <div className="content-preview">
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
          {
            timestamp && (
              <p className="gray-text marg-bot-0 marg-top-05 right italic">
                { moment(new Date(Number(timestamp))).fromNow(true) }
              </p>
            )
          }
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
  isThin: PropTypes.bool,
  timestamp: PropTypes.number,
};

export default Preview;
