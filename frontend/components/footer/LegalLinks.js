import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div className="footer-legal-content">
    <ul className="footer-nav">
      <li className="footer-nav-item">
        <Link to="/about">
          About Nalda
        </Link>
      </li>
      <li className="footer-nav-item">
        <Link to="/contact">
          Contact Us
        </Link>
      </li>
      <li className="footer-nav-item">
        <Link to="/credits">
          Credits
        </Link>
      </li>
      <li className="footer-nav-item">
        <Link to="/terms">
          Terms of Use
        </Link>
      </li>
      <li className="footer-nav-item">
        <Link to="/privacy">
          Privacy Policy
        </Link>
      </li>
    </ul>
    <p className="legal-copy">
      Copyright &copy; 2018 Nalda. All rights reserved.
    </p>
  </div>
);
