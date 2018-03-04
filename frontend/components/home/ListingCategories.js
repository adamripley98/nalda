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
      <div className="container">
        <div className="inline-header-link">
          <h4 className="marg-bot-1 dark-gray-text">
            Categories
          </h4>
        </div>
        <ul className="home-categories">
          {
            Object.keys(categoryMap).map(key => (
              <li className="category" key={key}>
                <Link to={`/categories/${key}`}>
                  {categoryMap[key]}
                </Link>
              </li>
            ))
          }
        </ul>
        <div className="line" />
      </div>
    );
  }
}

// Prop validations
ListingCategories.propTypes = {
  content: PropTypes.array,
};

export default ListingCategories;
