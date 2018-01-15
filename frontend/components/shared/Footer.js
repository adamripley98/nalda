// Import frameworks
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Renders the footer at the bottom of the screen on all pages.
 */
class Footer extends React.Component {
  // Render the component
  render() {
    return (
      <footer>
        <div className="container-fluid">
          <div className="footer-top">
            <div className="logo">
              <img src="https://s3.amazonaws.com/nalda/nalda_logo.svg" alt="Nalda" />
              Nalda
            </div>
            <div className="credits">
              &copy; 2018 Nalda. All rights reserved.
            </div>
            <div className="links">
              <Link to="/about">
                About Nalda
              </Link>
              <Link to="/contact">
                Contact us
              </Link>
              <Link to="/credits">
                Site credits
              </Link>
              <Link to="/terms">
                Terms of use
              </Link>
              <Link to="/privacy">
                Privacy policy
              </Link>
            </div>
          </div>
          <div className="footer-bottom">
            Developed by <a href="http://cameroncabo.com">Cameron Cabo</a> and <a href="https://github.com/adamripley98">Adam Ripley.</a>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
