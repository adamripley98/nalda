import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Renders the navbar at the top of the screen on all pages.
 *
 * TODO make this stateful depending on if the user is logged in or not.
 * Currently, it assumes that the user is not logged in.
 */
const Footer = () => {
  return (
    <footer>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-6 col-lg-3">
            <h3 className="bold">
              Nalda
            </h3>
            <p>
              This is some information about Nalda in one sentence
            </p>
          </div>
          <div className="col-12 col-md-6 col-lg-4 footer-nav">
            <strong>
              Navigation
            </strong>
            <div className="link">
              <Link to="/">
                Home
              </Link>
            </div>
            <div className="link">
              <Link to="/register">
                Register
              </Link>
            </div>
            <div className="link">
              <Link to="/login">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
