import React from 'react';
import PropTypes from 'prop-types';

import categoryMap from '../../json/categoryMap';

const EventCategories = ({ categories }) => {
  if (!categories) return null;

  return (
    <div className="categories">
      {
        Object.keys(categories).map(category => (
          categories[category] ? (
            <div className="category" key={ category }>
              { categoryMap[category] ? categoryMap[category] : category }
            </div>
          ) : null
        ))
      }
    </div>
  );
};

EventCategories.propTypes = {
  categories: PropTypes.object.isRequired,
};

export default EventCategories;
