import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div className="footer-social-links">
    <ul className="footer-social-icons">
      <li className="gf-social-item">
        <Link to="http://facebook.com/edwardkim.co" target="_blank" className="gf-facebook">
          <i className="fa fa-facebook fa-lg" />
        </Link>
      </li>
      <li className="gf-social-item">
        <Link to="http://twitter.com/imedwardkim" target="_blank" className="gf-twitter">
          <i className="fa fa-twitter fa-lg" />
        </Link>
      </li>
      <li className="gf-social-item">
        <Link to="http://instagram.com/imedwardkim" target="_blank" className="gf-instagram">
          <i className="fa fa-instagram fa-lg" />
        </Link>
      </li>
      <li className="gf-social-item">
        <Link to="http://instagram.com/imedwardkim" target="_blank" className="gf-youtube">
          <i className="fa fa-youtube-play fa-lg" />
        </Link>
      </li>
    </ul>
  </div>
);
