// Import frameworks
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// Import json
import categoryMap from '../json/categoryMap';

/**
 * Render the categories for all listings
 */
class ListingCategories extends Component {
  render() {
    console.log(categoryMap);
    return (
      <div className="container">
        <div className="inline-header-link">
          <h4>Categories</h4>
          <ul className="home-categories">
            {
              Object.keys(categoryMap).map(key => (
                <li className="category" key={key}>
                  {categoryMap[key]}
                </li>
              ))
            }
          </ul>
        </div>
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
