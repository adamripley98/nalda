// Import frameworks
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

/**
 * Component to render a listing
 */
const Review = ({title, content, createdAt, rating, name }) => {
  // Format the timestamp
  const timestamp = moment(createdAt).fromNow();

  // Full star
  const fullStar = (
    <i className="fa fa-star fa-lg full" aria-hidden="true" />
  );

  // Half star
  const halfStar = (
    <span className="half-star">
      <i className="fa fa-star fa-lg" />
      <i className="fa fa-star-half full fa-lg" />
    </span>
  );

  // Empty star
  const emptyStar = (
    <i className="fa fa-star fa-lg" aria-hidden="true" />
  );

  // Render the stars for the rating
  const renderRating = (
    <div className="rating">
      {
        rating === 0.5 ? (
          halfStar
        ) : (
          rating >= 1 ? fullStar : emptyStar
        )
      }
      {
        rating === 1.5 ? (
          halfStar
        ) : (
          rating >= 2 ? fullStar : emptyStar
        )
      }
      {
        rating === 2.5 ? (
          halfStar
        ) : (
          rating >= 3 ? fullStar : emptyStar
        )
      }
      {
        rating === 3.5 ? (
          halfStar
        ) : (
          rating >= 4 ? fullStar : emptyStar
        )
      }
      {
        rating === 4.5 ? (
          halfStar
        ) : (
          rating >= 5 ? fullStar : emptyStar
        )
      }
      <p>
        { rating } / 5.0
      </p>
    </div>
  );

  // Render the component
  return (
    <div className="review">
      <p className="timestamp">
        { timestamp }
      </p>
      { renderRating }
      <h6>
        { title }
      </h6>
      <p>
        { content }
      </p>
      <p className="name">
        - { name }
      </p>
    </div>
  );
};

Review.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  createdAt: PropTypes.number,
  rating: PropTypes.number,
  name: PropTypes.string,
};

export default Review;
