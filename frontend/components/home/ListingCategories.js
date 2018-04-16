// Import frameworks
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

// Import json
import categoryMap from '../json/categoryMap';

/**
 * Render the categories for all listings
 */
class ListingCategories extends Component {
  render() {
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
              <li className="category" key={key}>
                <Link to={`/listings/categories/${key}`}>
                  <div className="img" />
                  <span>{categoryMap[key]}</span>
                </Link>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

// Prop validations
ListingCategories.propTypes = {
  content: PropTypes.array,
};

export default ListingCategories;
