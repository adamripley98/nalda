import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class CategoryMenu extends Component {
  render() {
    return (
      <div className="footer-menu-single">
        <div className="expandable-toggle">
          <p className="footer-menu-heading">
            {this.props.menu.title}
          </p>
          <div className="footer-expand-icon" />
        </div>
        <nav className="footer-menu-list">
          {
            this.props.menu.categories.map(c => (
              <li key={c.slug}>
                <Link to={`/listings/categories/${c.slug}`}>
                  {c.title}
                </Link>
              </li>
            ))
          }
        </nav>
      </div>
    );
  }
}

CategoryMenu.propTypes = {
  menu: PropTypes.object,
};

export default CategoryMenu;
