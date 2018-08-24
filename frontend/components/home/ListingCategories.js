// Import frameworks
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Import json
import categoryMap from '../json/categoryMap';
import hiddenCategories from '../json/hiddenCategories';

/**
 * Render the categories for all listings
 */
const ListingCategories = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="home-section isLoading">
        <h2 className="home-section-title" />
        <p className="home-section-subtitle" />
        <ul className="home-categories">
          {
            Object.keys(categoryMap).map(key => (
              hiddenCategories[key] ? (null) : (
                <li className="category" key={key}>
                  <Link to="#">
                    {/* <div className="img" /> */}
                    <span />
                  </Link>
                </li>
              )
            ))
          }
        </ul>
      </div>
    );
  }

  return (
    <div className="home-section">
      <h2 className="home-section-title">
        What are you looking for?
      </h2>
      <p className="home-section-subtitle">
        See what Nalda has to offer.
      </p>
      <ul className="home-categories">
        {
          Object.keys(categoryMap).map(key => (
            hiddenCategories[key] ? (null) : (
              <li className="category" key={key}>
                <Link to={`/listings/categories/${key}`}>
                  {/* <div className="img" /> */}
                  <span>{categoryMap[key]}</span>
                </Link>
              </li>
            )
          ))
        }
      </ul>
    </div>
  );
};

ListingCategories.defaultProps = {
  isLoading: false,
};

ListingCategories.propTypes = {
  isLoading: PropTypes.bool,
};

export default ListingCategories;
