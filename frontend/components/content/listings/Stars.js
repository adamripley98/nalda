import React from 'react';
import PropTypes from 'prop-types';

const Stars = ({ rating }) => {
  if (rating === undefined || rating === null) return null;

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
  return (
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
};

Stars.defaultProps = {
  rating: undefined,
};

Stars.propTypes = {
  rating: PropTypes.number,
};

export default Stars;
