// Import frameworks
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Stars from './Stars';

/**
 * Component to render a listing
 */
const Review = ({title, content, createdAt, rating, name }) => {
  // Format the timestamp
  const timestamp = moment(createdAt).fromNow();

  // Render the component
  return (
    <div className="review">
      <p className="timestamp">
        { timestamp }
      </p>
      <Stars rating={ rating } />
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
