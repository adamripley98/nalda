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
          <div className="col-12 col-md-6 col-lg-4">
            <div className="pad-1">
              <h3 className="bold">
                Nalda
              </h3>
              <p>
                A centralized source for information, food, activities, and fun on your campus.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 footer-nav">
            <div className="pad-1">
              <p className="bold marg-bot-05">
                Navigation
              </p>
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
      </div>
    </footer>
  );
};

export default Footer;
