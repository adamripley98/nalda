import React from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

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
            Created by Cameron Cabo and Adam Ripley. Nalda © 2017.
          </div>
        </div>
      </footer>
    );
  }
}

Footer.propTypes = {
  userId: PropTypes.string,
};

const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
  };
};

const mapDispatchToProps = () => {
  return {};
};

// Redux config
Footer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Footer);

export default Footer;
