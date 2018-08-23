import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div className="footer-social-links">
    <ul className="footer-social-icons">
      <li className="gf-social-item">
        <Link to="https://www.facebook.com/naldacampus/" target="_blank" className="gf-facebook">
          <i className="fa fa-facebook fa-lg" />
        </Link>
      </li>
      <li className="gf-social-item">
        <Link to="https://www.instagram.com/naldacampus/" target="_blank" className="gf-instagram">
          <i className="fa fa-instagram fa-lg" />
        </Link>
      </li>
      <li className="gf-social-item">
        <Link to="https://www.youtube.com/channel/UCwND5nssp_nB7Zg7M2ve2sA/" target="_blank" className="gf-youtube">
          <i className="fa fa-youtube-play fa-lg" />
        </Link>
      </li>
    </ul>
  </div>
);
