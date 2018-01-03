import React from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

/**
 * Renders the navbar at the top of the screen on all pages.
 */
class Footer extends React.Component {
  // Render the component
  render() {
    return (
      <footer>
        <div className="footer-top">
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
                {
                  this.props.userId ? (
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
                        <Link to="/about">
                          About
                        </Link>
                      </div>
                      <div className="link">
                        <Link to="/articles">
                          Articles
                        </Link>
                      </div>
                      <div className="link">
                        <Link to="/listings">
                          Listings
                        </Link>
                      </div>
                      <div className="link">
                        <Link to="/videos">
                          Videos
                        </Link>
                      </div>
                    </div>
                  ) : (
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
                        <Link to="/about">
                          About
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
                  )
                }
              </div>
            </div>
            <div className="footer-bottom">
              Created by Cameron Cabo and Adam Ripley. Nalda © 2017.
            </div>
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
