import React from 'react';
import { Link } from 'react-router-dom';

import categoryMenues from './categoryMenues';

import CategoryMenu from './CategoryMenu';

export default () => (
  <div className="footer-menus">
    <div className="footer-flex">
      {
        categoryMenues.map(c => (
          <CategoryMenu
            key={c.title}
            menu={c}
          />
        ))
      }

      <div className="footer-menu-single">
        <div className="expandable-toggle">
          <p className="footer-menu-heading">Curated</p>
          <div className="footer-expand-icon" />
        </div>
        <nav className="footer-menu-list">
          <li><Link to="/listings">Recommended</Link></li>
          <li><Link to="/articles">Featured</Link></li>
          <li><Link to="/videos">Videos</Link></li>
        </nav>
      </div>
    </div>
  </div>
);
