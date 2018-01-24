// Import frameworks
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Import components
import Sidebar from './Sidebar';
import Search from './Search';
import Modal from '../auth/Modal';

/**
 * Renders the navbar at the top of the screen on all pages.
 */
class Nav extends Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      search: "",
      isLogin: true,
      searchActive: false,
    };

    // Bind this to helper functions
    this.searchCallback = this.searchCallback.bind(this);
    this.modalCallback = this.modalCallback.bind(this);
  }

  /**
   * Callback function to handle when the search is active or not
   */
  searchCallback(searchActive) {
    // Update the state to the state of the searchbar
    this.setState({
      searchActive,
    });
  }

  /**
   * Callback function to handle when the login modal is in login or register
   * states
   */
  modalCallback(isLogin) {
    // Update the state
    this.setState({
      isLogin: isLogin,
    });
  }

  /**
   * Render the navbar
   */
  render() {
    return (
      <nav className={ this.state.searchActive ? 'nav search-active' : 'nav' }>
        {/* Render the logo which links to the home page */}
        <Link to="/" className="logo">
          <img src="https://s3.amazonaws.com/nalda/nalda_logo.svg" alt="Nalda" />
        </Link>

        { /* Render the search bar on the left of the navbar */ }
        <Search callback={ this.searchCallback } />

        { /* Render the user's profile information if the user is logged in */ }
        { /* If the user is not logged in, an empty div is returned */ }
        { /* NOTE the empty div preserves styling of the sidebar */ }
        {
          this.props.userId ? (
            <div className="user-info">
              <div className="user-text">
                { /* Render the user's location information */ }
                <div className="location">
                  {
                    this.props.location && this.props.location.indexOf(",") > 0 ? (
                      this.props.location.substring(0, this.props.location.lastIndexOf(","))
                    ) : (
                      this.props.location || "Philadelphia, PA"
                    )
                  }
                </div>
                <div className="name">
                  <p>
                    Hi, <Link to="/account">{this.props.name}</Link>
                  </p>
                </div>
              </div>
              <div className="user-img" style={{ backgroundImage: `url(${this.props.profilePicture})` }}/>
            </div>
          ) : (
            <div className="user-info">
              <div className="sign-in-links">
                <button
                  className="btn login"
                  type="button"
                  data-toggle="modal"
                  data-target="#loginModal"
                  onClick={ () => this.modalCallback(true) }
                >
                  Login
                </button>
                <button
                  className="btn register"
                  type="button"
                  data-toggle="modal"
                  data-target="#loginModal"
                  onClick={ () => this.modalCallback(false) }
                >
                  Register
                </button>
              </div>
            </div>
          )
        }

        { /* Render the sidebar */ }
        { /* This includes the three-bar menu toggle which is always visible */ }
        <Sidebar modalCallback={ this.modalCallback } />

        { !this.props.userId && <Modal isLogin={ this.state.isLogin }/> }
      </nav>
    );
  }
}

Nav.propTypes = {
  userId: PropTypes.string,
  profilePicture: PropTypes.string,
  name: PropTypes.string,
  location: PropTypes.string,
};

const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
    profilePicture: state.authState.profilePicture,
    name: state.authState.name,
    location: state.authState.location,
  };
};

// Redux config
Nav = connect(
  mapStateToProps,
)(Nav);

export default Nav;
